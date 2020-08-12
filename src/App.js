import React from 'react';

import VersionSelector from './components/VersionSelector/VersionSelector';

import './App.css';
import aicsLogo from './aics-logo.png';
import aicsLogoName from './aics-logo-name.png';

const REPO_OWNER = "AllenInstitute";
const REPO = "aics-fms-file-explorer-app";

export const OS = {
    WINDOWS: "Windows",
    MAC: "Mac",
    LINUX: "Linux",
    UNKNOWN: "Unknown",
};
export const FILE_TYPE_FOR_OS = {
    [OS.WINDOWS]: "exe",
    [OS.MAC]: "dmg",
    [OS.LINUX]: "AppImage"
};
export const INSTRUCTIONS_FOR_OS = {
    [OS.WINDOWS]: "TBD",
    [OS.MAC]: "To open the app after download you must do the following the *first* time: \n 1) Locate the download in the file browser \n 2) Right-click the download \n 3) Click open and allow the mac to trust it",
    [OS.LINUX]: 'To open the app after download you must do the following: \n 1) Locate the download in file browser \n 2) Right-click the download \n 3) Click the "Properties" dropdown option \n 4) Click the "Permissions" tab \n 5) Ensure "Allow executing file as program" is checked',
};
Object.freeze(OS);
Object.freeze(FILE_TYPE_FOR_OS);
Object.freeze(INSTRUCTIONS_FOR_OS);

class App extends React.Component {

    static getOs = () => {
        if (navigator.appVersion.indexOf("Win") !==-1) {
            return OS.WINDOWS;
        }
        if (navigator.appVersion.indexOf("Mac") !==-1) {
            return OS.MAC;
        }
        if (navigator.appVersion.indexOf("Linux") !==-1) {
            return OS.LINUX;
        }
        return OS.UNKNOWN;
    };

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: undefined,
            loading: true,
            releases: undefined,
            selectedRelease: undefined,
            showOsSelector: false,
        };

        this.selectRelease = this.selectRelease.bind(this);
        this.toggleOsSelector = this.toggleOsSelector.bind(this);
    }

    componentDidMount() {
        this.fetchReleases();
    }

    fetchReleases() {
        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO}/releases`)
            .then((response) => response.json())
            .then(data => {
                const releases = data.sort((a, b) => b['created_at'].localeCompare(a['created_at']))
                this.setState({ releases, selectedRelease: releases[0] });
            })
            .catch((error) => {
                console.error(error);
                this.setState({ errorMessage: error.message })
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    selectRelease(selectedRelease) {
        console.log(selectedRelease);
        this.setState({ selectedRelease })
    }

    toggleOsSelector() {
        this.setState({ showOsSelector: !this.state.showOsSelector });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="App-logo-container">
                        <img src={aicsLogo} className="App-logo" alt="AICS logo" />
                        <img src={aicsLogoName} className="App-logo" alt="AICS name" />
                    </div>
                    <h1 className="App-title">File Explorer</h1>
                </header>
                <div className="App-body">
                    {this.state.errorMessage ? (
                        <div>
                            Encountered an error fetching releases: {this.state.errorMessage}
                        </div>
                    ) : (
                        this.state.loading ? (
                            <div>Loading...</div>
                        ): (
                            <VersionSelector
                                os={App.getOs()}
                                releases={this.state.releases}
                                selectedRelease={this.state.selectedRelease}
                                selectRelease={this.selectRelease}
                                showOsSelector={this.state.showOsSelector}
                                toggleOsSelector={this.toggleOsSelector}
                            />
                        )
                    )}
                </div>
                <footer className="App-footer">
                    <a
                        className="App-link"
                        href="https://github.com/AllenInstitute/aics-fms-file-explorer-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        File Explorer GitHub
                    </a>
                </footer>
            </div>
        );
    }
}

export default App;
