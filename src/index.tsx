import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

const ipcRenderer = window.require('electron').ipcRenderer;
const tableStart = "<table class=\"table-striped\"><thead> <tr>  <th>Name</th> <th>Results</th> </tr></thead><tbody>";
const tableEnd = "</tbody><tfoot> <tr>  <th>Name</th> <th>Results</th> </tr></tfoot></table>";
const msg = "<b>Test Results</b>";
const busyGif = "<img src=\"loading.gif\" />";
const log = window.require('electron-log');
(window as any).log = log;

function runTest() {

    let browserSelector = (document.getElementById('browser') as HTMLSelectElement);
    if (browserSelector) {
        let browser = browserSelector.options[browserSelector.selectedIndex].value;

        if (browser === '') {
            ipcRenderer.send('no-browser-warn', 'true');
        } else {
            (document.getElementById('result-msg') as any).innerHTML = ``;
            (document.getElementById('busy-gif') as any).innerHTML = `${busyGif}`;
            ipcRenderer.send('run-test', `${browser}`);
        }
    }

}

document.addEventListener("DOMContentLoaded", function(event) {
    (document.querySelector('[data-open-file]') as any).addEventListener('click', (e: any) => {
//        e.preventDefault();
//        ipcRenderer.send('file-dialog', 'true');
    });

    (document.querySelector('[data-open-file]') as any).addEventListener('change', (e: any) => {
    });
});

ipcRenderer.on('fileData', (event: any, data: any) => {

    (document.getElementById('filecontent') as any).innerHTML = data;

});

ipcRenderer.on('testResults', (event: any, data0: any) => {

    let {data} = data0;
    let end = data0.end;

    if (end || data.trim() === '') {
        (document.getElementById('busy-gif') as any).innerHTML = ``;
    }

    if (data.trim() !== '') {
        (document.getElementById('filecontent') as any).innerHTML = `${tableStart}${data}${tableEnd}`;
        (document.getElementById('result-msg') as any).innerHTML = `${msg}`;
    }

    if (end) {
        ipcRenderer.send('closeDriver', () => { });
    }

});

ipcRenderer.on('filePath', (event: any, data: any) => {

    (document.getElementById('file-path') as any).innerText = data;
    (document.getElementById('result-msg') as any).innerHTML = ``;

});
