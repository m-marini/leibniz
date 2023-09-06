import React, { Component } from 'react';
import { Form, FormGroup, FormControl, Tabs, Tab, Container, Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { ajax } from 'rxjs/ajax';
import { catchError, tap } from 'rxjs/operators';
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
import YAML from 'yaml';
import { of } from 'rxjs';
import { TextPanel } from './react/TextPanel';

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
  yaml?: string;
}

/**
 * Renders the application page
 */
export default class App extends Component<{}, AppState> {
  private leibniz: Leibniz | undefined;

  /**
   * Creates the application page
   * @param props the properties
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
   * Handles the on reset event
   * Opens the option panel to ask for resetting panel
   */
  private onReset() {
    this.showOptionPanel(
      'Reset definitions ?',
      'The definitions will be resetted to default value.',
      'Reset',
      () => this.reset()
    );
  }

  /**
   * Handles the load event
   * Opens the option panel to ask for predefined json files loading
   */
  private onLoad(name: string) {
    this.showOptionPanel(
      'Load definitions ' + name + ' ?',
      'The definitions will be load from ' + name + ' .',
      'Load',
      () => this.load(name)
    );
  }

  /**
   * Shows the option panel
   * @param optionTitle the title panel
   * @param optionMessage the message
   * @param optionConfirmBtn the confirm button text
   * @param optionConfirm the confirm call back
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
   * Hides the option panel
   */
  private hideOptionPanel() {
    this.setState({ optionShow: false });
  }

  /**
   * Shows the alert panel
   * @param title the title panel
   * @param message the message
   */
  private showAlert(title: string, message: string) {
    this.setState({
      alertShow: true,
      alertTitle: title,
      alertMessage: message
    });
  }

  /**
   * Hides the alert panel
   */
  private hideAlert() {
    this.setState({ alertShow: false });
  }

  /**
   * Resets the definitions
   */
  private reset() {
    this.processDefs(DefaultDefinition);
    this.hideOptionPanel();
  }

  /**
   * Load the definition from predefined files
   * @param name the file name
   */
  private load(name: string) {
    const url = `/${homepage}/${name}`;
    ajax<string>({
      url,
      responseType: 'text'
    }).pipe(
      tap(ajax => this.onLoaded(ajax.response)),
      catchError(
        error => {
          this.onLoadError(error);
          return of(error);
        }
      ),
    ).subscribe();
  }

  /**
   * Handles the load event.
   * Validates the definitions and starts the simulation process
   * @param json the json definition
   */
  private onLoaded(text: string) {
    this.hideOptionPanel();
    try {
      this.importFile(text);
    } catch (ex: any) {
      this.onError(ex);
    }
  }

  /**
   * Handles the load error event
   * Shows the alert panel with the error message
   * @param ajax the ajax message
   */
  private onLoadError(ajax: any) {
    console.error(ajax);
    const msg = ajax.xhr.status + ' - ' + ajax.xhr.statusText;
    console.error(msg);
    this.showAlert('Error', msg);
    this.hideOptionPanel();
  }

  /**
   * Shows the import panel to ask for file import and confirmation
   */
  private showImportPanel() {
    this.setState({ importModalShown: true });
  }

  /**
   * Hides the import panel
   */
  private hideImportPanel() {
    this.setState({ importModalShown: false });
  }

  /**
   * Imports the process definition from text content
   * @param content the content
   */
  private importFile(content: string) {
    try {
      this.hideAlert();
      this.hideImportPanel();
      const json = YAML.parse(content);
      if (validateSystemDefinition(json)) {
        this.processDefs(json);
      }
      this.setState({ yaml: content });
    } catch (e) {
      console.error('Error parsing', content);
      this.onError('' + e);
    }
  }

  /**
   * Handles the parsing error event
   * @param e the error message
   */
  private onError(e: string) {
    this.showAlert('Error', 'Error parsing file ' + e);
    this.hideImportPanel();
  }

  /**
   * Shows the export panel to ask for export file confirmation
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
   * Sets the maximum dt value
   * @param maxDt the maximum value
   */
  private setMaxDt(maxDt: string) {
    this.setState({ maxDt: maxDt });
    if (this.leibniz) {
      const dtnum1 = parseFloat(maxDt);
      this.leibniz.maxDt = Math.max(MinDt, dtnum1);
    }
  }

  /**
   * Restart the simulation
   */
  private restart() {
    const { leibniz } = this.state;
    if (leibniz) {
      leibniz.resetStatus();
    }
  }

  /**
   * Export the file
   */
  private exportFile() {
    const { defs } = this.state;
    this.hideOptionPanel();
    if (defs) {
      const exporting = _.defaults({ version: CurrentSysDefVersion }, defs);
      const text = YAML.stringify(exporting);
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "leibniz.yml");
    }
  }

  /**
   * Renders the application page
   */
  render() {
    const {
      alertShow, alertTitle, alertMessage,
      importModalShown,
      optionShow, optionTitle, optionMessage, optionConfirmBtn, optionConfirm,
      maxDt, defs, errors, rules
    } = this.state;
    const yaml = defs
      ? YAML.stringify(defs)
      : '---';
    const errorsList = errors
      ? toErrorsText(errors)
      : undefined;
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
                </FormGroup>
                <FormGroup>
                  <Button onClick={ev => this.restart()}>Restart</Button>
                </FormGroup>
              </Form>
            </Tab>
            <Tab eventKey="editor" title="Editor">
              <Editor defs={defs} errors={errors}
                onChange={defs => this.processDefs(defs)} />
            </Tab>
            <Tab eventKey="yaml" title="Yaml">
              <TextPanel text={yaml} errorList={errorsList} />
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

/**
 * Returns the errors map
 * @param sysErrors the system errors
 */
function toErrorsText(sysErrors: SystemErrors): [string, string[]][] | undefined {
  const bodiesErrors = sysErrors.bodies.flatMap((bodyError, i) => {
    const positionErrors = bodyError.position.length > 0 ? [[`bodies[${i}].position`, bodyError.position] as [string, string[]]] : []
    const rotationErrors = bodyError.rotation && bodyError.rotation.length > 0
      ? [[`P[${i}].rotation`, bodyError.rotation] as [string, string[]]]
      : [];
    return [...positionErrors, ...rotationErrors];
  })
  const funcsErrors = _(_.toPairs(sysErrors.funcs))
    .filter(([id, errors]) =>
      errors.length > 0
    )
    .map(([id, errors]) => [`funcs.${id}`, errors] as [string, string[]])
    .value();

  const initialStatusErrors = _(_.toPairs(sysErrors.initialStatus))
    .filter(([id, errors]) =>
      errors.length > 0
    )
    .map(([id, errors]) => [`initialStatus.${id}`, errors] as [string, string[]])
    .value();

  const transitionErrors = _(_.toPairs(sysErrors.transition))
    .filter(([id, errors]) =>
      errors.length > 0
    )
    .map(([id, errors]) => [`transition.${id}`, errors] as [string, string[]])
    .value();

  const errors = [
    ...bodiesErrors,
    ...funcsErrors,
    ...initialStatusErrors,
    ...transitionErrors
  ];

  return errors.length > 0 ? errors : undefined;
}