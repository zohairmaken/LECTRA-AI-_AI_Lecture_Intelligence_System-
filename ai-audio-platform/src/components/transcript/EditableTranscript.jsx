import React, { useState } from 'react';
import Button from '../common/Button';

const EditableTranscript = ({ initialText, onSave }) => {
    const [text, setText] = useState(initialText);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        onSave(text);
        setIsEditing(false);
    };

    return (
        <div className="editable-transcript">
            {isEditing ? (
                <div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ width: '100%', minHeight: '100px', padding: '0.5rem', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }}
                    />
                    <div style={{ marginTop: '0.5rem' }}>
                        <Button onClick={handleSave} size="small">Save</Button>
                        <Button onClick={() => setIsEditing(false)} variant="secondary" size="small" style={{ marginLeft: '0.5rem' }}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <div onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', padding: '0.5rem', border: '1px solid transparent', borderRadius: '4px' }} title="Click to edit">
                    {text}
                </div>
            )}
        </div>
    );
};

export default EditableTranscript;
