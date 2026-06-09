import React, { useState } from 'react';
import QuestionItem from './QuestionItem';
import Button from '../common/Button';

const QuizCard = ({ quiz, onSubmit }) => {
    const [answers, setAnswers] = useState({});

    const handleOptionSelect = (questionId, option) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = () => {
        onSubmit(answers);
    };

    return (
        <div className="quiz-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                borderBottom: '1px solid var(--surface-border)',
                paddingBottom: '1rem'
            }}>
                <h2>// ACTIVE_QUIZ_SESSION</h2>
                <span style={{ color: 'var(--accent-color)', fontFamily: 'monospace' }}>ID: {quiz.id}</span>
            </div>

            {quiz.questions.map(q => (
                <QuestionItem
                    key={q.id}
                    question={q}
                    selectedOption={answers[q.id]}
                    onOptionSelect={handleOptionSelect}
                />
            ))}

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== quiz.questions.length}
                    variant="primary"
                    size="large"
                >
                    Submit Assessment
                </Button>
            </div>
        </div>
    );
};

export default QuizCard;
