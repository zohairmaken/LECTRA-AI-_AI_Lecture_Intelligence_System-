import React from 'react';

const SpeakerTimeline = ({ segments }) => {
    if (!segments || segments.length === 0) return <div>No speaker segments available.</div>;

    return (
        <div className="speaker-timeline" style={{ display: 'flex', height: '30px', backgroundColor: '#eee', marginTop: '1rem', borderRadius: '4px', overflow: 'hidden' }}>
            {segments.map((seg, index) => (
                <div
                    key={index}
                    style={{
                        flex: seg.duration,
                        backgroundColor: seg.speaker === 'Speaker 1' ? 'var(--primary-color)' : 'var(--secondary-color)',
                        opacity: 0.7,
                        borderRight: '1px solid #fff'
                    }}
                    title={`${seg.speaker}: ${seg.startTime} - ${seg.endTime}`}
                />
            ))}
        </div>
    );
};

export default SpeakerTimeline;
