import path from 'path';
import React from 'react';
import "../node_modules/bootstrap/scss/bootstrap.scss";

const log = window.require('electron-log');
const ipcRenderer = window.require('electron').ipcRenderer;

interface IProps {
}

interface IState {
    fileHint: string;
    results: string;
}

export default class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            fileHint: 'Выберите файл...',
            results: ''
        };

        ipcRenderer.on('results', (event: any, data: any) => {

            this.setState({results: `Всего: ${Math.round(data.total)}Mb`});

        });

    }

    onFileSelect() {
        let el = document.getElementById("customFile");
        // @ts-ignore
        let file = el.files[0];
        if (file) {
            log.info('change yo', file);
            let fileName = path.basename(file.path);
            let slicedFn = fileName;
            const MAX_LEN = 20;
            if (fileName.length > MAX_LEN + 3) {
                slicedFn = '...' + fileName.slice(fileName.length - MAX_LEN);
            }
            ipcRenderer.send('process-file', file.path);
            this.setState({fileHint: slicedFn});
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 pl-0">
                        <h6 className="text-muted mb-3">Выберите PDF файл детализации</h6>
                        <fieldset>
                            <div className="custom-file w-100">
                                <input type="file" className="custom-file-input" accept="application/pdf"
                                       id="customFile" data-open-file onChange={() => this.onFileSelect()}/>
                                <label className="custom-file-label" htmlFor="customFile">{this.state.fileHint}</label>
                            </div>
                        </fieldset>
                        {this.state.results}
                    </div>
                </div>
            </div>
        );
    }
}
