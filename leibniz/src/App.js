import React, { Component } from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Alert, Grid, Navbar, Tabs, Tab, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import * as Cookies from 'js-cookie';
import { saveAs } from 'file-saver/FileSaver';
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

const conf1 = {
  bodies: [],
  funcs: {},
  vars: {},
  update: {}
};

class App extends Component {

  constructor(props) {
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

  processConf(conf) {
    const result = new SystemParser(conf).parse();
    const state = {
      conf: conf,
      result: result
    };
    Cookies.set('leibniz', JSON.stringify(conf));
    if (result.system) {
      this.leibniz.system = result.system;
    }
    return state;
  }

  onChange(conf) {
    this.setState(this.processConf(conf));
  }

  onSceneMount(e) {
    const leibniz = new Leibniz(e);
    leibniz.init({
      cameraType: 'ar',
      subSteps: this.state.subSteps
    });
    this.leibniz = leibniz;
    this.setState(this.processConf(this.state.initialConf));
  }

  onReset() {
    this.showOptionPanel(
      'Reset definitions ?',
      'The definitions will be resetted to default value.',
      'Reset',
      () => this.reset()
    );
  }

  onLoad(name) {
    this.showOptionPanel(
      'Load definitions ' + name + ' ?',
      'The definitions will be load from ' + name + ' .',
      'Load',
      () => this.load(name)
    );
  }

  showOptionPanel(title, message, confirmButton, confirmAction) {
    this.setState({
      optionShow: true,
      optionTitle: title,
      optionMessage: message,
      optionConfirmBtn: confirmButton,
      optionConfirm: confirmAction
    });
  }

  hideOptionPanel() {
    this.setState({ optionShow: false });
  }

  showAlert(title, message) {
    this.setState({
      alertShow: true,
      alertTitle: title,
      alertMessage: message
    });
  }

  hideAlert() {
    this.setState({ alertShow: false });
  }

  reset() {
    const state = this.processConf(conf1);
    this.setState(state);
    this.hideOptionPanel();
  }

  onLoaded(ajax) {
    const state = this.processConf(ajax.response);
    this.setState(state);
    this.hideOptionPanel();
  }

  onLoadError(ajax) {
    const msg = ajax.xhr.status + ' - ' + ajax.xhr.statusText;
    console.error(msg);
    this.showAlert('Error', msg);
    this.hideOptionPanel();
  }

  load(name) {
    ajax({
      url: name,
      createXHR: function () {
        return new XMLHttpRequest();
      }
    }).subscribe(
      ajax => this.onLoaded(ajax),
      (ajax) => this.onLoadError(ajax)
    );
  }

  test() {
    return (
      <Tab eventKey={3} title="Test">
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

  showImportPanel() {
    this.setState({ importModalShown: true });
  }

  hideImportPanel() {
    this.setState({ importModalShown: false });
  }

  importFile(content) {
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

  onError(e) {
    this.showAlert('Error', 'Error parsing file ' + e);
    this.hideImportPanel();
  }

  showExportPanel() {
    this.showOptionPanel(
      'Export definitions ?',
      'The definitions will be exported into a local file.',
      'Export',
      () => this.exportFile()
    );
  }

  setSubSteps(value) {
    this.setState({ subSteps: value });
    this.leibniz.subSteps = parseInt(value);
  }

  exportFile() {
    const text = JSON.stringify(this.state.conf, null, '  ');
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "test.json");
    this.hideOptionPanel();
  }

  render() {
    const alert = this.state.alertShow ?
      (
        <Alert bsStyle="danger" onDismiss={() => this.hideAlert()}>
          <h4>{this.state.alertTitle}</h4>
          <p>{this.state.alertMessage}</p>
        </Alert>
      ) : '';
    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#brand">Leibniz</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown id="predefNavDropdown" eventKey="navItem.1" title="Predefined">
                <NavItem eventKey="navItem.reset" onClick={() => this.onReset()}>
                  Reset
              </NavItem>
                <NavItem eventKey="navItem.solaris" onClick={() => this.onLoad('solaris.json')}>
                  Solaris (Earth - Sun)
              </NavItem>
                <NavItem eventKey="navItem.selene" onClick={() => this.onLoad('selene.json')}>
                  Selene (Moon -Earth)
              </NavItem>
              </NavDropdown>
              <NavItem eventKey="navItem.2" onClick={() => this.showImportPanel()}>
                Import
              </NavItem>
              <NavItem eventKey="navItem.3" onClick={() => this.showExportPanel()}>
                Export
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {alert}
        <Grid>
          <Tabs id="Tab" defaultActiveKey={1}>
            <Tab eventKey={1} title="Home">
              <BabylonScene onSceneMount={ev => this.onSceneMount(ev)}
                canvasClass="graphCanvas" />
              <Form inline>
                <FormGroup controlId="formInlineName" bsSize="sm">
                  <ControlLabel>Sub Steps</ControlLabel>{' '}
                  <FormControl type="text" placeholder="Sub Steps"
                    onInput={ev => this.setSubSteps(ev.target.value)}
                    onChange={() => { }}
                    value={this.state.subSteps} />
                </FormGroup>{' '}
              </Form>
            </Tab>
            <Tab eventKey={2} title="Editor">
              <Editor result={this.state.result.parserState} onChange={conf => this.onChange(conf)} />
            </Tab>
            <Tab eventKey={3} title="Dump panel">
              <DumpPanel result={this.state.result} />
            </Tab>
          </Tabs>
        </Grid>
        <ImportFile show={this.state.importModalShown}
          onCancel={() => this.hideImportPanel()}
          onFileRead={file => this.importFile(file)}
          onError={e => this.onError(e)} />
        <OptionPanel show={this.state.optionShow}
          title={this.state.optionTitle}
          message={this.state.optionMessage}
          confirmButton={this.state.optionConfirmBtn}
          onCancel={() => this.hideOptionPanel()}
          onConfirm={() => this.state.optionConfirm()} />
      </div >
    );
  }
}

export default App;
