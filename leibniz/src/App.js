import React, { Component } from 'react';
import { Grid, Navbar, Tabs, Tab, Nav, NavItem, Modal, Button } from 'react-bootstrap';
import * as Cookies from 'js-cookie';
import './App.css';
import { BabylonScene } from './SceneComponent';
import { Editor } from './Editor';
import { SystemParser } from './leibniz-ast-0.1.1';
import { Leibniz } from './leibniz-0.1.3';
import { Test } from './Test';
import { default as conf } from './conf';

const conf1 = {
  bodies: [{
    position: '(0,0,0)'
  }],
  funcs: {},
  vars: {},
  update: {}
};

class App extends Component {

  constructor(props) {
    super(props);

    const cfgCookie = Cookies.get('leibniz');
    const cfg = cfgCookie ? JSON.parse(cfgCookie) : conf;

    this.state = {
      modalShown: false,
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
      //      cameraType: 'ar',
    });
    this.leibniz = leibniz;
    this.setState(this.processConf(this.state.initialConf));
  }


  onReset() {
    this.setState({
      modalShown: true,
      modalTitle: 'Reset definitions ?',
      modalMessage: 'The definitions will be resetted to default value.'
    });
  }

  onHideModal() {
    this.setState({ modalShown: false });
  }

  onConfirmModal() {
    const state = this.processConf(conf);
    state.modalShown = false;
    this.setState(state);
  }

  test() {
    return (
      <Tab eventKey={3} title="Test">
        <Test initialConf={conf} />
      </Tab>
    );
  }

  render() {
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
              <NavItem eventKey={1} onClick={() => this.onReset()}>
                Reset
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Grid>
          <Tabs id="Tab" defaultActiveKey={1}>
            <Tab eventKey={1} title="Home">
              <BabylonScene onSceneMount={ev => this.onSceneMount(ev)}
                canvasClass="graphCanvas" />
            </Tab>
            <Tab eventKey={2} title="Editor">
              <Editor result={this.state.result.parserState} onChange={conf => this.onChange(conf)} />
            </Tab>
          </Tabs>
          <Modal bsSize="small" show={this.state.modalShown} onHide={() => this.onHideModal()}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.modalTitle}</Modal.Title>
              <Modal.Body>{this.state.modalMessage}</Modal.Body>
              <Modal.Footer>
                <Button bsStyle="primary" onClick={() => this.onHideModal()}>Cancel</Button>
                <Button bsStyle="danger" onClick={() => this.onConfirmModal()}>Reset</Button>
              </Modal.Footer>
            </Modal.Header>
          </Modal>
        </Grid>
      </div >
    );
  }
}

export default App;
