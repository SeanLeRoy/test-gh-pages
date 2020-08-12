import React from 'react';

import { OS, FILE_TYPE_FOR_OS, INSTRUCTIONS_FOR_OS } from '../../App';

import './VersionSelector.css';

export default function VersionSelector({ os, releases, selectedRelease, selectRelease, showOsSelector, toggleOsSelector }) {

    if (os === OS.UNKNOWN) {
        return (
            <div>
                Unable to determine operating system. Please select your operating system.
                <select
                    className="Version-selector"
                    name="os-selector"
                    id="os-selector"
                >
                    {Object.values(OS).map(operatingSystem => (
                        <option value={operatingSystem} key={operatingSystem} onClick={() => console.log("ah!")}>
                            {operatingSystem}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    const assetForOs = selectedRelease['assets'].filter(a => (
        a['name'].endsWith(FILE_TYPE_FOR_OS[os])
    ))[0];
    const downloadName = assetForOs['name'];
    const downloadLinkForOS = assetForOs['browser_download_url'];

    return (
        <div className="Version-selector-container">
            {showOsSelector ? (
                <div>
                    <label>Operating System</label>
                    <select
                        className="Version-selector"
                        name="os-selector"
                        id="os-selector"
                        value={os}
                        onChange={(e) => console.log(e.target)}
                    >
                        {Object.values(OS).filter(o => o !== OS.UNKNOWN).map(operatingSystem => (
                            <option value={operatingSystem} key={operatingSystem} onClick={() => console.log("ah!")}>
                                {operatingSystem}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <p onClick={() => toggleOsSelector()}>Not currently using a {os} computer?</p>
            )}
            <label>Version</label>
            <select
                className="Version-selector"
                name="version-selector"
                id="version-selector"
                value={selectedRelease}
                onChange={(e) => console.log(e.target)}
            >
                {releases.map((release, index) => (
                    <option value={release['tag_name']} key={release['tag_name']} onClick={() => selectRelease(release)}>
                        {release['tag_name']}{index === 0 && " (latest)"}
                    </option>
                ))}
            </select>
            <a href={downloadLinkForOS} download={downloadName}>
                <button className="Download-button">
                    Download
                </button>
            </a>
            <h2 className="Os-instructions-title">Instructions for {os}</h2>
            <p className="Os-instructions">{INSTRUCTIONS_FOR_OS[os]}</p>
        </div>
    );
}
