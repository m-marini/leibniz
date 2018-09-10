import React, { Component } from 'react';
import { Grid, Navbar, Tabs, Tab, Nav, NavItem } from 'react-bootstrap';
import * as Cookies from 'js-cookie';
import './App.css';
import { BabylonScene } from './SceneComponent';
import { Editor } from './Editor';
import { SystemParser } from './leibniz-ast-0.1.1';
import { Leibniz } from './leibniz-0.1.3';
import { Test } from './Test';
import {default as conf} from './conf';

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
    console.log('Reset');
    this.setState(this.processConf(conf));
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
            <Tab eventKey={3} title="Test">
              <Test initialConf={conf} />
            </Tab>
          </Tabs>
        </Grid>
      </div >
    );
  }
}

export default App;
