import React, { Component } from 'react';
import { Grid, Navbar, Tabs, Tab, Jumbotron } from 'react-bootstrap';
import * as Cookies from 'js-cookie';
import './App.css';
import { BabylonScene } from './SceneComponent';
import { Editor } from './Editor';
import { SystemParser } from './leibniz-ast-0.1.0';
import { Leibniz } from './leibniz-0.1.2';


const conf1 = {
  bodies: [{
    position: '(0,0,0)'
  }],
  funcs: {},
  vars: {},
  update: {}
};

const conf = {
  "funcs": {
    "r": "1",
    "omega00": "2*PI",
    "omega01": "2*PI/2",
    "omega02": "2*PI/4",
    "omega10": "2*PI/0.3",
    "omega11": "2*PI/0.5",
    "omega12": "2*PI/0.7",
    "axis0": "ex",
    "axis1": "ey",
    "axis2": "ez"
  },
  "vars": {
    "theta0": "0",
    "theta1": "0.1",
    "theta2": "0.2",
    "phi0": "0",
    "phi1": "0",
    "phi2": "0"
  },
  "update": {
    "phi0": "phi0 + omega00 * dt",
    "phi1": "phi1 + omega01 * dt",
    "phi2": "phi2 + omega02 * dt",
    "theta0": "theta0 + omega10 * dt",
    "theta1": "theta1 + omega11 * dt",
    "theta2": "theta2 + omega12 * dt",
  },
  "bodies": [
    {
      "position": "r * (cos(phi0) * ex + sin(phi0) * ey)",
      "rotation": "qrot(axis0 * theta0)"
    },
    {
      "position": "r * (cos(phi1) * ex + sin(phi1) * ey)",
      "rotation": "qrot(axis1 * theta1)"
    },
    {
      "position": "r * (cos(phi2) * ex + sin(phi2) * ey)",
      "rotation": "qrot(axis2 * theta2)"
    }
  ]
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
        </Grid>
      </div >
    );
  }
}

export default App;
