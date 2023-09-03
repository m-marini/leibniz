import React, { Component } from 'react';
import { Form, FormGroup, FormControl, Tabs, Tab, Container } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { ajax } from 'rxjs/ajax';
import { tap } from 'rxjs/operators';
import './App.css';
import { BabylonScene, SceneMountEvent } from './react/SceneComponent';
import { Editor } from './react/Editor';
import { ImportFile } from './react/ImportFile';
import { OptionPanel } from './react/OptionPanel';
import { DumpPanel } from './react/DumpPanel';
import { LbNavBar } from './react/LbNavBar';
import { LbAlert } from './react/LbAlert';
import { CurrentSysDefVersion, SystemDefinition, SystemErrors, SystemRules } from './modules/leibniz-defs';
import { CameraType, Leibniz } from './modules/leibniz-renderer';
import { compile, validateSystemDefinition } from './modules/leibniz-compiler';
import _ from 'lodash';

const homepage = `${process.env.REACT_APP_HOMEPAGE}`;
const KEY = 'leibniz';
const MinDt = 1e-3;

const DefaultDefinition: SystemDefinition = {
  version: CurrentSysDefVersion,
  bodies: [],
  funcs: {},
  initialStatus: {},
  transition: {}
};

interface AppState {
  alertShow: boolean;
  alertTitle?: string;
  alertMessage?: string;
  modalShown: boolean;
  importModalShown: boolean;
  maxDt: string;
  optionShow?: boolean;
  optionTitle?: string;
  optionMessage?: string;
  optionConfirmBtn?: string;
  optionConfirm?: () => void,
  defs?: SystemDefinition;
  rules?: SystemRules;
  errors?: SystemErrors;
  leibniz?: Leibniz;
}

export default class App extends Component<{}, AppState> {
  private leibniz: Leibniz | undefined;

  /**
   * 
   * @param props 
   */
  constructor(props: {}) {
    super(props);

    this.state = {
      maxDt: '0.01',
      alertShow: false,
      modalShown: false,
      importModalShown: false,
    };
  }

  /**
   * 
   * @param conf 
   */
  private processDefs(defs: SystemDefinition, leibniz?: Leibniz) {
    const leib = leibniz ?? this.state.leibniz;
    const { rules, errors } = compile(defs);
    localStorage.setItem(KEY, JSON.stringify(defs));

    if (leib) {
      leib.rules = rules;
    }
    this.setState({ defs, rules, errors });
  }

  /**
   * 
   * @param e 
   */
  private onSceneMount(e: SceneMountEvent) {
    const leibniz = new Leibniz(e);
    leibniz.init({
      cameraType: CameraType.ArcRotate,
      maxDt: parseFloat(this.state.maxDt)
    });
    this.setState({ leibniz });
    const text = localStorage.getItem(KEY);
    const defs = text ? JSON.parse(text) : DefaultDefinition;
    this.processDefs(defs, leibniz);
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
    this.processDefs(DefaultDefinition);
    this.hideOptionPanel();
  }

  /**
   * 
   * @param name 
   */
  private load(name: string) {
    const url = `/${homepage}/${name}`;
    ajax.getJSON(url).pipe(
      tap(
        json => this.onLoaded(json),
        ajax => this.onLoadError(ajax)
      )
    ).subscribe();
  }

  /**
   * 
   * @param json 
   */
  private onLoaded(json: any) {
    this.hideOptionPanel();
    try {
      if (validateSystemDefinition(json)) {
        this.processDefs(json);
      }
    } catch (ex: any) {
      this.onError(ex);
    }
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
      this.hideAlert();
      this.hideImportPanel();
      const json = JSON.parse(content);
      if (validateSystemDefinition(json)) {
        this.processDefs(json);
      }
    } catch (e) {
      console.error('Error parsing', content);
      this.onError('' + e);
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
  private setMaxDt(maxDt: string) {
    this.setState({ maxDt: maxDt });
    if (this.leibniz) {
      const dtnum1 = parseFloat(maxDt);
      this.leibniz.maxDt = Math.max(MinDt, dtnum1);
    }
  }

  /**
   * 
   */
  private exportFile() {
    const { defs } = this.state;
    this.hideOptionPanel();
    if (defs) {
      const exporting = _.defaults({ version: CurrentSysDefVersion }, defs);
      const text = JSON.stringify(exporting, null, 2);
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "test.json");
    }
  }

  /**
   * 
   */
  render() {
    const {
      alertShow, alertTitle, alertMessage,
      importModalShown,
      optionShow, optionTitle, optionMessage, optionConfirmBtn, optionConfirm,
      maxDt, defs, errors, rules
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
              <Form>
                <FormGroup controlId="formInlineName">
                  <Form.Label>Max dt</Form.Label>{' '}
                  <FormControl type="text" placeholder="Max dt"
                    onChange={ev => this.setMaxDt(ev.target.value)}
                    value={maxDt} />
                </FormGroup>{' '}
              </Form>
            </Tab>
            <Tab eventKey="editor" title="Editor">
              <Editor defs={defs} errors={errors}
                onChange={defs => this.processDefs(defs)} />
            </Tab>
            <Tab eventKey="dump" title="Dump panel">
              <DumpPanel rules={rules} />
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
