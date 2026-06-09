import React from 'react';
import SpeakerTag from './SpeakerTag';

/**
 * Parse the backend's transcript_text (plain string) into displayable segments.
 * Backend format: "SPEAKER_00: Hello world\nSPEAKER_01: Hi there"
 */
const parseTranscriptText = (text) => {
    if (!text) return [];
    return text
        .split('\n')
        .filter(line => line.trim())
        .map((line, index) => {
            // Try to extract "Speaker: text" pattern
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0 && colonIndex < 30) {
                return {
                    speaker: line.substring(0, colonIndex).trim(),
                    text: line.substring(colonIndex + 1).trim(),
                    index,
                };
            }
            return { speaker: 'Unknown', text: line.trim(), index };
        });
};

const TranscriptViewer = ({ transcript }) => {
    if (!transcript) return <div style={{ color: 'var(--text-muted)' }}>No transcript data available...</div>;

    // Support both parsed segments array and raw transcript_text string
    const segments = transcript.segments || parseTranscriptText(transcript.transcript_text);

    if (!segments || segments.length === 0) {
        return (
            <div style={{ color: 'rgba(255,255,255,0.5)', padding: '2rem', textAlign: 'center', letterSpacing: '1px' }}>
                {transcript.status === 'Completed'
                    ? 'No transcript content found.'
                    : `Processing in progress... (Status: ${transcript.status || 'Unknown'})`
                }
            </div>
        );
    }

    // Assign consistent colors to speakers
    const speakerSet = [...new Set(segments.map(s => s.speaker))];
    const speakerColors = ['#00f3ff', '#bd00ff', '#ffe600', '#05ffa1', '#ff2a6d', '#fff'];

    // Group consecutive segments by same speaker for cleaner display
    const groupedSegments = [];
    let currentGroup = null;

    segments.forEach((segment) => {
        if (currentGroup && currentGroup.speaker === segment.speaker) {
            currentGroup.texts.push(segment.text);
        } else {
            currentGroup = {
                speaker: segment.speaker,
                texts: [segment.text],
                startIndex: segment.index
            };
            groupedSegments.push(currentGroup);
        }
    });

    return (
        <div className="transcript-viewer" style={{
            textAlign: 'left',
            padding: '0.5rem',
            maxHeight: '600px',
            overflowY: 'auto'
        }}>
            {groupedSegments.map((group, index) => {
                const speakerIdx = speakerSet.indexOf(group.speaker);
                const color = speakerColors[speakerIdx % speakerColors.length];

                return (
                    <div key={index} style={{
                        marginBottom: '1rem',
                        padding: '1rem 1.2rem',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderLeft: `3px solid ${color}`,
                        borderRadius: '0 6px 6px 0',
                        transition: 'background 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                    >
                        <div style={{ marginBottom: '0.5rem' }}>
                            <SpeakerTag speaker={group.speaker} color={color} />
                        </div>
                        {group.texts.map((text, tIdx) => (
                            <p key={tIdx} style={{
                                margin: '0.3rem 0', color: '#fff', fontSize: '0.9rem',
                                lineHeight: '1.6', paddingLeft: '0.25rem'
                            }}>
                                {text}
                            </p>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default TranscriptViewer;
