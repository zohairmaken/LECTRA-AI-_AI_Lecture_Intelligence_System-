import React from 'react';

const SpeakerTag = ({ speaker, color }) => {
    // Use provided color or fallback to theme colors
    const tagColor = color || 'var(--primary-color)';

    return (
        <span style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: tagColor,
            border: `1.5px solid ${tagColor}`,
            boxShadow: `0 0 10px ${tagColor}33`,
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '0.75em',
            marginRight: '8px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            display: 'inline-block'
        }}>
            {speaker}
        </span>
    );
};

export default SpeakerTag;
