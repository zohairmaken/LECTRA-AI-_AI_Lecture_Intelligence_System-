import React from 'react';

const QuestionItem = ({ question, selectedOption, onOptionSelect }) => {
    return (
        <div className="question-item glass-panel" style={{
            marginBottom: '1.5rem',
            textAlign: 'left',
            padding: '1.5rem',
            border: '1px solid var(--surface-border)'
        }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
                <span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>::</span>
                {question.text}
            </h4>
            <div className="options" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {question.options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    return (
                        <label key={index} style={{
                            padding: '1rem',
                            backgroundColor: isSelected ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? 'var(--primary-color)' : 'transparent'}`,
                            borderRadius: 'var(--border-radius)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: isSelected ? '0 0 10px var(--primary-glow)' : 'none'
                        }}>
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={isSelected}
                                onChange={() => onOptionSelect(question.id, option)}
                                style={{ marginRight: '1rem', accentColor: 'var(--primary-color)' }}
                            />
                            <span style={{ color: isSelected ? '#fff' : 'var(--text-muted)' }}>{option}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionItem;
