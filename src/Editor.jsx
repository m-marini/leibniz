import React, { Component } from 'react';
import { DefsPanel } from './DefsPanel';
import { default as _ } from 'lodash';
import { BodiesPanel } from './BodiesPane';
import { Form } from 'react-bootstrap';

/*
 * this.props.result = parse state
 */
class Editor extends Component {

  createConf() {
    return {
      bodies: this.createBodies(),
      funcs: this.createDefs(this.props.result.funcs),
      update: this.createDefs(this.props.result.update),
      vars: this.createDefs(this.props.result.vars),
    }
  }

  createBodies() {
    return _.map(this.props.result.bodies, b =>
      (b.rotation) ?
        {
          position: b.position.exp,
          rotation: b.rotation.exp
        } :
        {
          position: b.position.exp
        }
    );
  }

  createDefs(defs) {
    return _.mapValues(defs, 'exp');
  }

  onChange(panelKey, value) {
    if (this.props.onChange) {
      const conf = this.createConf();
      conf[panelKey] = value;
      this.props.onChange(conf);
    }
  }

  onBodiesChange(bodies) {
    if (this.props.onChange) {
      const conf = this.createConf();
      conf.bodies = bodies;
      this.props.onChange(conf);
    }
  }

  render() {
    const { result } = this.props;
    const hasError = _.flatMap(result.funcs, 'errors').length > 0;
    return (
      <Form noValidate validated={!hasError} >
        <BodiesPanel bodies={this.props.result.bodies}
          onChange={bodies => this.onBodiesChange(bodies)} />
        <DefsPanel panelKey="funcs" title="Macros" defs={result.funcs}
          onChange={(panelId, value) => this.onChange(panelId, value)}
        />
        <DefsPanel panelKey="vars" title="Variables" defs={this.props.result.vars}
          onChange={(panelId, value) => this.onChange(panelId, value)}
        />
        <DefsPanel panelKey="update" title="Update" defs={this.props.result.update}
          onChange={(panelId, value) => this.onChange(panelId, value)}
        />
      </Form>
    );
  }
}

export { Editor };
