import React from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';

/**
 * Parses inline formatting like **bold**, *italic*, and `code`
 */
function renderInlineFormatting(text) {
  if (!text) return null;

  // Split by bold (**text**) or code (`text`)
  const parts = [];
  let remaining = text;
  let key = 0;

  // Regex to match **bold** or `code`
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      parts.push(
        <strong key={`b-${key++}`} style={{ fontWeight: 800 }}>
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      parts.push(
        <code
          key={`c-${key++}`}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.85em'
          }}
        >
          {matchedStr.slice(1, -1)}
        </code>
      );
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      parts.push(
        <em key={`i-${key++}`} style={{ fontStyle: 'italic' }}>
          {matchedStr.slice(1, -1)}
        </em>
      );
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Beautiful, user-friendly Markdown & Travel AI response renderer
 */
export default function MarkdownMessage({ content, isUser = false }) {
  const theme = useTheme();

  if (!content) return null;
  if (isUser) {
    return <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.55 }}>{content}</Typography>;
  }

  const lines = content.split('\n');
  const renderedElements = [];

  let inList = false;
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      renderedElements.push(
        <Box
          key={`list-${renderedElements.length}`}
          component="ul"
          sx={{
            m: 0,
            pl: 2.2,
            mb: 1.2,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.8
          }}
        >
          {currentList}
        </Box>
      );
      currentList = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      flushList();
      return;
    }

    // Main Headers: ### or ## or #
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushList();
      const level = trimmed.startsWith('### ') ? 3 : trimmed.startsWith('## ') ? 2 : 1;
      const headingText = trimmed.replace(/^#+\s*/, '');
      renderedElements.push(
        <Box key={`h-${idx}`} sx={{ mt: idx === 0 ? 0.2 : 1.6, mb: 0.8 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              color: theme.palette.mode === 'dark' ? '#38bdf8' : '#0369a1',
              fontSize: level === 1 ? '1.05rem' : level === 2 ? '0.96rem' : '0.9rem',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1.3
            }}
          >
            {renderInlineFormatting(headingText)}
          </Typography>
          <Divider sx={{ mt: 0.4, mb: 0.8, opacity: 0.4 }} />
        </Box>
      );
      return;
    }

    // Bullet points (• or - or *)
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const bulletText = trimmed.replace(/^[•\-*]\s*/, '');
      currentList.push(
        <Box
          component="li"
          key={`li-${idx}`}
          sx={{
            fontSize: '0.86rem',
            lineHeight: 1.5,
            color: 'text.primary',
            '&::marker': {
              color: theme.palette.primary.main,
              fontSize: '1em'
            }
          }}
        >
          {renderInlineFormatting(bulletText)}
        </Box>
      );
      return;
    }

    // Numbered lists (1. , 2. )
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      flushList();
      renderedElements.push(
        <Box
          key={`num-${idx}`}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            mb: 0.8,
            fontSize: '0.86rem',
            lineHeight: 1.5
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)',
              color: theme.palette.mode === 'dark' ? '#38bdf8' : '#0284c7',
              fontWeight: 800,
              fontSize: '0.74rem',
              width: 22,
              height: 22,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.2
            }}
          >
            {numberedMatch[1]}
          </Box>
          <Box sx={{ flex: 1 }}>{renderInlineFormatting(numberedMatch[2])}</Box>
        </Box>
      );
      return;
    }

    // Regular paragraphs / title lines (e.g. ♿ **Complete Preparation Guide...**)
    flushList();
    renderedElements.push(
      <Typography
        key={`p-${idx}`}
        sx={{
          fontSize: '0.88rem',
          lineHeight: 1.55,
          mb: 0.8,
          color: 'text.primary'
        }}
      >
        {renderInlineFormatting(trimmed)}
      </Typography>
    );
  });

  flushList();

  return <Box sx={{ display: 'flex', flexDirection: 'column' }}>{renderedElements}</Box>;
}
