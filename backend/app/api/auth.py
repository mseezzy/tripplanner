import uuid
import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel, EmailStr
from backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    generate_totp_secret,
    verify_totp_code
)

router = APIRouter(prefix='/api/auth', tags=['Authentication'])

# In-memory storage for users & temp MFA tokens
user_db = {}
temp_mfa_sessions = {}

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = 'Traveler'

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    token: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class MfaSetupRequest(BaseModel):
    email: EmailStr

class MfaEnableRequest(BaseModel):
    email: EmailStr
    code: str

class MfaChallengeRequest(BaseModel):
    temp_token: str
    code: str

class SSOCallbackRequest(BaseModel):
    provider: str
    email: EmailStr
    name: Optional[str] = 'SSO Traveler'
    sso_token: str

@router.post('/register', status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest):
    email = req.email.lower()
    if email in user_db:
        raise HTTPException(status_code=400, detail='An account with this email already exists.')
    
    verification_token = str(uuid.uuid4())
    user_db[email] = {
        'email': email,
        'name': req.name,
        'hashed_password': hash_password(req.password),
        'is_verified': False,
        'verification_token': verification_token,
        'mfa_enabled': False,
        'totp_secret': None,
        'sso_providers': []
    }
    return {
        'message': 'Registration successful. Please verify your email.',
        'email': email,
        'is_verified': False,
        'verification_token': verification_token
    }

@router.post('/verify-email')
def verify_email(req: VerifyEmailRequest):
    email = req.email.lower()
    user = user_db.get(email)
    if not user:
        raise HTTPException(status_code=404, detail='User not found.')
    
    if user['verification_token'] != req.token:
        raise HTTPException(status_code=400, detail='Invalid or expired verification token.')
    
    user['is_verified'] = True
    user['verification_token'] = None
    return {'message': 'Email verified successfully!', 'is_verified': True}

@router.post('/login')
def login(req: LoginRequest):
    email = req.email.lower()
    user = user_db.get(email)
    if not user or not verify_password(req.password, user['hashed_password']):
        raise HTTPException(status_code=401, detail='Invalid email or password.')
    
    if not user['is_verified']:
        raise HTTPException(status_code=403, detail='Please verify your email before logging in.')
    
    if user['mfa_enabled']:
        temp_token = str(uuid.uuid4())
        temp_mfa_sessions[temp_token] = email
        return {
            'mfa_required': True,
            'temp_token': temp_token,
            'message': 'Multi-factor authentication code required.'
        }
    
    access_token = create_access_token(data={'sub': email, 'name': user['name']})
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user': {
            'email': email,
            'name': user['name'],
            'is_verified': user['is_verified'],
            'mfa_enabled': user['mfa_enabled']
        }
    }

@router.post('/mfa/setup')
def mfa_setup(req: MfaSetupRequest):
    email = req.email.lower()
    user = user_db.get(email)
    if not user:
        raise HTTPException(status_code=404, detail='User not found.')
    
    secret = generate_totp_secret()
    user['totp_secret'] = secret
    totp_uri = f'otpauth://totp/Tripplanner:{email}?secret={secret}&issuer=FamilyTravelPlanner'
    return {
        'totp_secret': secret,
        'totp_uri': totp_uri,
        'instructions': 'Enter the 16-character secret or scan the QR code into Google Authenticator or Authy.'
    }

@router.post('/mfa/enable')
def mfa_enable(req: MfaEnableRequest):
    email = req.email.lower()
    user = user_db.get(email)
    if not user or not user.get('totp_secret'):
        raise HTTPException(status_code=400, detail='Please initialize MFA setup first.')
    
    if not verify_totp_code(user['totp_secret'], req.code):
        raise HTTPException(status_code=400, detail='Invalid 6-digit TOTP authentication code.')
    
    user['mfa_enabled'] = True
    return {'message': 'MFA successfully enabled for your account.', 'mfa_enabled': True}

@router.post('/mfa/challenge')
def mfa_challenge(req: MfaChallengeRequest):
    email = temp_mfa_sessions.get(req.temp_token)
    if not email:
        raise HTTPException(status_code=400, detail='Invalid or expired MFA session token.')
    
    user = user_db.get(email)
    if not user or not verify_totp_code(user.get('totp_secret'), req.code):
        raise HTTPException(status_code=401, detail='Invalid 6-digit TOTP authentication code.')
    
    del temp_mfa_sessions[req.temp_token]
    access_token = create_access_token(data={'sub': email, 'name': user['name']})
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user': {
            'email': email,
            'name': user['name'],
            'is_verified': user['is_verified'],
            'mfa_enabled': user['mfa_enabled']
        }
    }

@router.post('/sso/callback')
def sso_callback(req: SSOCallbackRequest):
    email = req.email.lower()
    user = user_db.get(email)
    
    if not user:
        # Create user via SSO (pre-verified)
        user_db[email] = {
            'email': email,
            'name': req.name,
            'hashed_password': hash_password(str(uuid.uuid4())),
            'is_verified': True,
            'verification_token': None,
            'mfa_enabled': False,
            'totp_secret': None,
            'sso_providers': [req.provider]
        }
    else:
        if req.provider not in user.get('sso_providers', []):
            user.setdefault('sso_providers', []).append(req.provider)
        user['is_verified'] = True

    user = user_db[email]
    access_token = create_access_token(data={'sub': email, 'name': user['name']})
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user': {
            'email': email,
            'name': user['name'],
            'is_verified': True,
            'mfa_enabled': user['mfa_enabled'],
            'sso_provider': req.provider
        }
    }

@router.get('/me')
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Missing or invalid authorization header.')
    
    token = authorization.split(' ')[1]
    payload = decode_access_token(token)
    if not payload or not payload.get('sub'):
        raise HTTPException(status_code=401, detail='Invalid or expired JWT token.')
    
    user = user_db.get(payload['sub'])
    if not user:
        raise HTTPException(status_code=404, detail='User not found.')
    
    return {
        'email': user['email'],
        'name': user['name'],
        'is_verified': user['is_verified'],
        'mfa_enabled': user['mfa_enabled'],
        'sso_providers': user.get('sso_providers', [])
    }
