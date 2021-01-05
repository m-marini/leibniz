import React, { Component } from 'react';
import { DefsPanel } from './DefsPanel';
import { default as _ } from 'lodash';
import { BodiesPanel } from './BodiesPane';
import { Form } from 'react-bootstrap';
import { BodyStructure, SystemDefinition, SystemErrors } from '../modules/leibniz-defs';

interface EditorProps {
  defs?: SystemDefinition;
  errors?: SystemErrors;
  onChange?: (conf: SystemDefinition) => void;
};

/**
 * 
 */
export class Editor extends Component<EditorProps, {}> {
  /**
   * 
   * @param panelKey 
   * @param value 
   */
  private onChange(panelKey: string, value: Record<string, string>) {
    const { onChange, defs } = this.props;
    if (onChange && defs) {
      const newDefs = _.clone(defs);
      (newDefs as any)[panelKey] = value;
      onChange(newDefs);
    }
  }

  /**
   * 
   * @param bodies 
   */
  private onBodiesChange(bodies: BodyStructure<string>[]) {
    const { onChange, defs } = this.props;
    if (onChange && defs) {
      const newDefs = _.clone(defs);
      newDefs.bodies = bodies;
      onChange(newDefs);
    }
  }

  render() {
    const { defs, errors } = this.props;
    return (
      <Form noValidate >
        <BodiesPanel bodies={defs?.bodies}
          errors={errors?.bodies}
          onChange={bodies => this.onBodiesChange(bodies)} />
        <DefsPanel panelKey="funcs" title="Functions"
          defs={defs?.funcs} errors={errors?.funcs}
          onChange={(panelId, value) => this.onChange(panelId, value)}
        />
        <DefsPanel panelKey="initialStatus" title="Initial Status"
          defs={defs?.initialStatus} errors={errors?.initialStatus}
          onChange={(panelId, value) => this.onChange(panelId, value)}
        />
        <DefsPanel panelKey="transition" title="Transition"
          defs={defs?.transition} errors={errors?.transition}
          onChange={(panelId, value) => this.onChange(panelId, value)}
        />
      </Form>
    );
  }
}
