import path from 'path';
import React, {ReactNode} from 'react';
import "bootstrap/scss/bootstrap.scss";

const log = window.require('electron-log');
const ipcRenderer = window.require('electron').ipcRenderer;

interface State {
  fileHint: string;
  results: string;
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      fileHint: 'Выберите файл...',
      results: ''
    };

    ipcRenderer.on('results', (event: any, data: any) => {

      log.info('App got results', data);
      this.setState({results: `Всего: ${Math.round(data.total)}Mb`});

    });

  }

  onFileSelect(): void {
    const el = document.getElementById("customFile");
    const file = (el as any).files[0];
    if (file) {
      log.info('change yo', file);
      const fileName = path.basename(file.path);
      let slicedFn = fileName;
      const MAX_LEN = 20;
      if (fileName.length > MAX_LEN + 3) {
        slicedFn = '...' + fileName.slice(fileName.length - MAX_LEN);
      }
      ipcRenderer.send('process-file', file.path, '2019-01-26');
      this.setState({fileHint: slicedFn});
    }
  }

  render(): ReactNode {
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
