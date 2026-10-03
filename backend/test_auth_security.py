import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    generate_totp_secret,
    verify_totp_code
)
from app.api.auth import user_db, temp_mfa_sessions

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_user_db():
    user_db.clear()
    temp_mfa_sessions.clear()

def test_password_hashing_security():
    password = 'SecretTripPassword123!'
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password('WrongPassword', hashed) is False

def test_jwt_token_lifecycle():
    token = create_access_token(data={'sub': 'traveler@example.com'})
    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get('sub') == 'traveler@example.com'

def test_totp_mfa_verification():
    secret = generate_totp_secret()
    import pyotp
    totp = pyotp.TOTP(secret)
    valid_code = totp.now()
    assert verify_totp_code(secret, valid_code) is True
    assert verify_totp_code(secret, '000000') is False

def test_user_registration_and_email_verification_flow():
    # 1. Register
    reg_response = client.post('/api/auth/register', json={
        'email': 'family@travel.com',
        'password': 'SecurePassword123!',
        'name': 'The Smiths'
    })
    assert reg_response.status_code == 201
    reg_data = reg_response.json()
    assert reg_data['email'] == 'family@travel.com'
    assert reg_data['is_verified'] is False
    verification_token = reg_data['verification_token']

    # 2. Login before verification fails
    login_fail = client.post('/api/auth/login', json={
        'email': 'family@travel.com',
        'password': 'SecurePassword123!'
    })
    assert login_fail.status_code == 403
    assert 'verify your email' in login_fail.json()['detail'].lower()

    # 3. Verify Email
    verify_res = client.post('/api/auth/verify-email', json={
        'email': 'family@travel.com',
        'token': verification_token
    })
    assert verify_res.status_code == 200
    assert verify_res.json()['is_verified'] is True

    # 4. Login after verification succeeds
    login_success = client.post('/api/auth/login', json={
        'email': 'family@travel.com',
        'password': 'SecurePassword123!'
    })
    assert login_success.status_code == 200
    assert 'access_token' in login_success.json()

def test_mfa_login_flow():
    # Register & verify
    reg_res = client.post('/api/auth/register', json={
        'email': 'mfa@travel.com',
        'password': 'SecurePassword123!',
        'name': 'MFA User'
    })
    token = reg_res.json()['verification_token']
    client.post('/api/auth/verify-email', json={'email': 'mfa@travel.com', 'token': token})

    # Enable MFA
    mfa_setup = client.post('/api/auth/mfa/setup', json={'email': 'mfa@travel.com'})
    assert mfa_setup.status_code == 200
    secret = mfa_setup.json()['totp_secret']

    import pyotp
    totp = pyotp.TOTP(secret)
    code = totp.now()

    # Verify MFA enable
    client.post('/api/auth/mfa/enable', json={'email': 'mfa@travel.com', 'code': code})

    # Login triggers MFA challenge
    login_res = client.post('/api/auth/login', json={'email': 'mfa@travel.com', 'password': 'SecurePassword123!'})
    assert login_res.status_code == 200
    assert login_res.json()['mfa_required'] is True
    temp_token = login_res.json()['temp_token']

    # Complete MFA challenge
    mfa_challenge = client.post('/api/auth/mfa/challenge', json={'temp_token': temp_token, 'code': totp.now()})
    assert mfa_challenge.status_code == 200
    assert 'access_token' in mfa_challenge.json()

def test_sso_authentication_google_facebook_github():
    for provider in ['google', 'facebook', 'github']:
        sso_res = client.post('/api/auth/sso/callback', json={
            'provider': provider,
            'email': f'sso_{provider}@example.com',
            'name': f'SSO {provider.capitalize()} User',
            'sso_token': f'mock_{provider}_token_12345'
        })
        assert sso_res.status_code == 200
        assert 'access_token' in sso_res.json()
        assert sso_res.json()['user']['is_verified'] is True
