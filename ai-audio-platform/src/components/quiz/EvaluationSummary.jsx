import React from 'react';

const EvaluationSummary = ({ evaluation }) => {
    return (
        <div className="evaluation-summary" style={{ textAlign: 'left', marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)' }}>
            <h3>Performance Evaluation</h3>
            <div>
                <strong>Strengths:</strong>
                <ul>
                    {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
            <div>
                <strong>Areas for Improvement:</strong>
                <ul>
                    {evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
        </div>
    );
};

export default EvaluationSummary;
