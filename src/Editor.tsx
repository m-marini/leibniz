import React, { Component } from 'react';
import { DefsPanel } from './DefsPanel';
import { default as _ } from 'lodash';
import { BodiesPanel } from './BodiesPane';
import { Form } from 'react-bootstrap';
import { SystemNode, ExpressionNodes } from './Interpreter';
import { SystemDefinition, Definitions, BodyDefinitions } from './Definitions';

interface EditorProps {
  result: SystemNode;
  onChange?: (conf: SystemDefinition) => void;
};

/**
 * 
 */
export class Editor extends Component<EditorProps, {}> {

  /**
   * 
   */
  private createConf() {
    return {
      bodies: this.createBodies(),
      funcs: this.createDefs(this.props.result.funcs),
      update: this.createDefs(this.props.result.update),
      vars: this.createDefs(this.props.result.vars),
    }
  }

  /**
   * 
   */
  private createBodies(): BodyDefinitions {
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

  /**
   * 
   * @param defs 
   */
  private createDefs(defs: ExpressionNodes): Definitions {
    return _.mapValues(defs, 'exp');
  }

  /**
   * 
   * @param panelKey 
   * @param value 
   */
  private onChange(panelKey: string, value: Definitions) {
    const { onChange } = this.props;
    if (onChange) {
      const conf = this.createConf() as unknown as Record<string, Definitions>;
      conf[panelKey] = value;
      onChange(conf as unknown as SystemDefinition);
    }
  }

  /**
   * 
   * @param bodies 
   */
  private onBodiesChange(bodies: BodyDefinitions) {
    const { onChange } = this.props;
    if (onChange) {
      const conf = this.createConf();
      conf.bodies = bodies;
      onChange(conf);
    }
  }

  render() {
    const { result } = this.props;
    return (
      <Form noValidate >
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
