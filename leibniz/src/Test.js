import React, { Component } from 'react';
import { default as _ } from 'lodash';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { SystemParser } from './leibniz-ast-0.1.1';

/*
 * this.props.result = parse state
 */
class Test extends Component {

  constructor(props) {
    super(props);
    this.state = this.createNewState(
      JSON.stringify(props.initialConf ||
        {
          vars: {
            a: "0"
          },
          funcs: {
            b: "0"
          },
          update: {},
          bodies: []
        }, null, '  '));
  }

  onInput(value) {
    this.setState(this.createNewState(value));
  }

  createNewState(conf) {
    var text;
    try {
      const cfg = JSON.parse(conf);
      const result = new SystemParser(cfg).parse();
      text = JSON.stringify(result, null, '  ');
    } catch (e) {
      console.error(e);
      text = e.toString();
    }
    return {
      conf: conf,
      result: text
    };
  }

  render() {
    return (
      <form>
        <FormGroup controlId="conf">
          <ControlLabel>Configuration</ControlLabel>
          <FormControl componentClass="textarea" placeholder="Configuration"
            rows="5"
            value={this.state.conf}
            onInput={(ev) => this.onInput(ev.target.value)}
            onChange={() => { }} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Result</ControlLabel>
          <FormControl.Static><pre>{this.state.result}</pre></FormControl.Static>
        </FormGroup>
      </form>
    );
  }
}

export { Test };
