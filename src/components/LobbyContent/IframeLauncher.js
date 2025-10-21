import React from 'react';
import '../../App.css'

const IframeLauncher = ({ gameUrl, onClose }) => {
    return (
        <div id="iframe_launcher">
            <iframe
                id="gameiframe"
                src={gameUrl}
                title="Game Frame"
            />
            <button onClick={onClose} className="iframe-close-button">
                Close
            </button>
        </div>
    );
};

export default IframeLauncher;
