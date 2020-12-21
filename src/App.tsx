import React, { Component } from 'react';
import { Form, FormGroup, FormControl, Tabs, Tab, Container } from 'react-bootstrap';
import * as Cookies from 'js-cookie';
import { saveAs } from 'file-saver';
import './App.css';
import { BabylonScene } from './SceneComponent';
import { Editor } from './Editor';
import { SystemParser } from './leibniz-ast-0.1.1';
import { Leibniz } from './leibniz-0.1.3';
import { Test } from './Test';
import { ImportFile } from './ImportFile';
import { OptionPanel } from './OptionPanel';
import { DumpPanel } from './DumpPanel';
import { ajax } from 'rxjs/ajax';
import { tap } from 'rxjs/operators';
import { LbNavBar } from './LbNavBar';
import { LbAlert } from './LbAlert';
import { SystemDefinition } from './Definitions';

const conf1 = {
  bodies: [],
  funcs: {},
  vars: {},
  update: {}
};

interface AppState {
  alertShow: boolean;
  alertTitle?: string;
  alertMessage?: string;
  modalShown: boolean;
  importModalShown: boolean;
  result: any;
  subSteps: string;
  initialConf: any;
  optionShow?: boolean;
  optionTitle?: string;
  optionMessage?: string;
  optionConfirmBtn?: string;
  optionConfirm?: () => void,
  conf?: any;
}

export class App extends Component<{}, AppState> {
  private leibniz: Leibniz | undefined;

  /**
   * 
   * @param props 
   */
  constructor(props: {}) {
    super(props);

    const cfgCookie = Cookies.get('leibniz');
    const cfg = cfgCookie ? JSON.parse(cfgCookie) : conf1;

    this.state = {
      subSteps: "1",
      alertShow: false,
      modalShown: false,
      importModalShown: false,
      initialConf: cfg,
      result: {
        parserState: {
          bodies: [],
          funcs: {},
          update: {},
          vars: {}
        }
      }
    };
  }

  /**
   * 
   * @param conf 
   */
  private processConf(conf: SystemDefinition) {
    const result = new SystemParser(conf).parse();
    const state = {
      conf: conf,
      result: result
    };
    Cookies.set('leibniz', JSON.stringify(conf));
    if (result.system && this.leibniz) {
      this.leibniz.system = result.system;
    }
    return state;
  }

  /**
   * 
   * @param conf 
   */
  private onChange(conf: SystemDefinition) {
    this.setState(this.processConf(conf));
  }

  /**
   * 
   * @param e 
   */
  private onSceneMount(e: any) {
    const leibniz = new Leibniz(e);
    leibniz.init({
      cameraType: 'ar',
      subSteps: this.state.subSteps
    });
    this.leibniz = leibniz;
    this.setState(this.processConf(this.state.initialConf));
  }

  /**
   * 
   */
  private onReset() {
    this.showOptionPanel(
      'Reset definitions ?',
      'The definitions will be resetted to default value.',
      'Reset',
      () => this.reset()
    );
  }

  private onLoad(name: string) {
    this.showOptionPanel(
      'Load definitions ' + name + ' ?',
      'The definitions will be load from ' + name + ' .',
      'Load',
      () => this.load(name)
    );
  }

  /**
   * 
   * @param optionTitle 
   * @param optionMessage 
   * @param optionConfirmBtn 
   * @param optionConfirm 
   */
  private showOptionPanel(optionTitle: string, optionMessage: string, optionConfirmBtn: string, optionConfirm: () => void) {
    this.setState({
      optionShow: true,
      optionTitle,
      optionMessage,
      optionConfirmBtn,
      optionConfirm
    });
  }

  /**
   * 
   */
  private hideOptionPanel() {
    this.setState({ optionShow: false });
  }

  /**
   * 
   * @param title 
   * @param message 
   */
  private showAlert(title: string, message: string) {
    this.setState({
      alertShow: true,
      alertTitle: title,
      alertMessage: message
    });
  }

  /**
   * 
   */
  private hideAlert() {
    this.setState({ alertShow: false });
  }

  /**
   * 
   */
  private reset() {
    const state = this.processConf(conf1);
    this.setState(state);
    this.hideOptionPanel();
  }

  /**
   * 
   * @param name 
   */
  private load(name: string) {
    const url = process.env.REACT_APP_BASENAME + '/' + name;
    ajax.getJSON(url).pipe(
      tap(
        json => this.onLoaded(json as SystemDefinition),
        ajax => this.onLoadError(ajax)
      )
    ).subscribe();
  }

  /**
   * 
   * @param json 
   */
  private onLoaded(json: SystemDefinition) {
    console.log(json);
    const state = this.processConf(json);
    this.setState(state);
    this.hideOptionPanel();
  }

  private onLoadError(ajax: any) {
    console.error(ajax);
    const msg = ajax.xhr.status + ' - ' + ajax.xhr.statusText;
    console.error(msg);
    this.showAlert('Error', msg);
    this.hideOptionPanel();
  }

  /**
   * 
   */
  private test() {
    return (
      <Tab eventKey="test" title="Test">
        <Test initialConf={{
          vars: {
            "a": "a0",
            "b": "inv(a0)",
            "c": "a*b"
          }, funcs: {
            "a0": "T((8,1,6),(3,5,7),(4,9,2))",
          }, bodies: [], update: {}
        }} />
      </Tab>
    );
  }

  /**
   * 
   */
  private showImportPanel() {
    this.setState({ importModalShown: true });
  }

  /**
   * 
   */
  private hideImportPanel() {
    this.setState({ importModalShown: false });
  }

  /**
   * 
   * @param content 
   */
  private importFile(content: string) {
    try {
      const state = this.processConf(JSON.parse(content));
      this.setState(state);
      this.hideAlert();
      this.hideImportPanel();
    } catch (e) {
      console.error('Error parsing', content);
      this.onError(e);
    }
  }

  /**
   * 
   * @param e 
   */
  private onError(e: string) {
    this.showAlert('Error', 'Error parsing file ' + e);
    this.hideImportPanel();
  }

  /**
   * 
   */
  private showExportPanel() {
    this.showOptionPanel(
      'Export definitions ?',
      'The definitions will be exported into a local file.',
      'Export',
      () => this.exportFile()
    );
  }

  /**
   * 
   * @param value 
   */
  private setSubSteps(value: string) {
    this.setState({ subSteps: value });
    if (this.leibniz) {
      this.leibniz.subSteps = parseInt(value);
    }
  }

  /**
   * 
   */
  private exportFile() {
    const text = JSON.stringify(this.state.conf, null, '  ');
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "test.json");
    this.hideOptionPanel();
  }

  /**
   * 
   */
  render() {
    const {
      alertShow, alertTitle, alertMessage,
      importModalShown,
      optionShow, optionTitle, optionMessage, optionConfirmBtn, optionConfirm,
      result, subSteps
    } = this.state;
    return (
      <Container fluid>
        <LbNavBar
          onReset={() => this.onReset()}
          onLoad={(file) => this.onLoad(file)}
          onImport={() => this.showImportPanel()}
          onExport={() => this.showExportPanel()}
        />
        <LbAlert isVisible={alertShow}
          title={alertTitle}
          message={alertMessage}
          onClose={() => this.hideAlert()} />
        <Container>
          <Tabs id="Tab" defaultActiveKey="home">
            <Tab eventKey="home" title="Home">
              <BabylonScene onSceneMount={(ev: any) => this.onSceneMount(ev)}
                canvasClass="graphCanvas" />
              <Form inline>
                <FormGroup controlId="formInlineName">
                  <Form.Label>Sub Steps</Form.Label>{' '}
                  <FormControl type="text" placeholder="Sub Steps"
                    onChange={ev => this.setSubSteps(ev.target.value)}
                    value={subSteps} />
                </FormGroup>{' '}
              </Form>
            </Tab>
            <Tab eventKey="editor" title="Editor">
              <Editor result={result.parserState} onChange={conf => this.onChange(conf)} />
            </Tab>
            <Tab eventKey="dump" title="Dump panel">
              <DumpPanel result={result} />
            </Tab>
          </Tabs>
        </Container>
        <ImportFile show={importModalShown}
          onCancel={() => this.hideImportPanel()}
          onFileRead={file => this.importFile(file as string)}
          onError={e => this.onError(e)} />
        <OptionPanel show={!!optionShow}
          title={optionTitle}
          message={optionMessage}
          confirmButton={optionConfirmBtn || ''}
          onCancel={() => this.hideOptionPanel()}
          onConfirm={optionConfirm} />
      </Container>
    );
  }
}
