import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { SystemParser } from './leibniz-ast-0.1.1';

/*
 * this.props.result = parse state
 */
export class Test extends Component {

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
        <Form.Group controlId="conf">
          <Form.Label>Configuration</Form.Label>
          <Form.Control componentClass="textarea" placeholder="Configuration"
            rows="5"
            value={this.state.conf}
            onInput={(ev) => this.onInput(ev.target.value)}
            onChange={() => { }} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Result</Form.Label>
          <Form.Control.Static><pre>{this.state.result}</pre></Form.Control.Static>
        </Form.Group>
      </form>
    );
  }
}
