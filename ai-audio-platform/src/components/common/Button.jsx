import React, { useState } from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled = false, type = 'button', size = 'medium', style = {} }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Variadic styles
    const baseColor = variant === 'primary' ? 'var(--primary-color)' :
        variant === 'secondary' ? 'var(--secondary-color)' :
            'var(--text-color)';

    const glowColor = variant === 'primary' ? 'var(--primary-glow)' :
        variant === 'secondary' ? 'var(--secondary-glow)' :
            'rgba(255,255,255,0.3)';

    const padding = size === 'small' ? '0.4rem 0.8rem' : '0.8rem 1.8rem';
    const fontSize = size === 'small' ? '0.8rem' : '1rem';

    const styles = {
        padding: padding,
        fontSize: fontSize,
        fontFamily: 'var(--font-family-display)',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: disabled ? 'rgba(255,255,255,0.3)' : (variant === 'outline' ? baseColor : '#000'),
        backgroundColor: variant === 'outline' ? 'transparent' : baseColor,
        border: `1px solid ${baseColor}`,
        borderRadius: '4px', // More angular for tech feel
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: (isHovered && !disabled) ? `0 0 15px ${glowColor}, inset 0 0 5px ${glowColor}` : 'none',
        transform: (isHovered && !disabled) ? 'translateY(-2px)' : 'none',
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
        ...style
    };

    // clip-path for futuristic corner cut effect (optional, keeping square for now)
    // clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={styles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </button>
    );
};

export default Button;
