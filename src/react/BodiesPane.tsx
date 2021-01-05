import React, { Component } from 'react';
import { Accordion, Button, Card, Table } from 'react-bootstrap';
import { default as _ } from 'lodash';
import { BodyRow } from './BodyRow';
import { OptionPanel } from './OptionPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { BodyStructure, Errors } from '../modules/leibniz-defs';

interface BodiesPanelProps {
  bodies?: BodyStructure<string>[];
  errors?: BodyStructure<Errors>[];
  onChange?: (arg: BodyStructure<string>[]) => void;
};

export class BodiesPanel extends Component<BodiesPanelProps, {
  modalShown: boolean;
  modalTitle?: string;
  modalMessage?: string;
  confirmAction?: () => void;
}> {

  constructor(props: BodiesPanelProps) {
    super(props);
    this.state = {
      modalShown: false
    };
  }

  /**
   * 
   * @param title 
   * @param message 
   * @param action 
   */
  private showOptionPanel(title: string, message: string, action: () => void) {
    this.setState({
      modalShown: true,
      modalTitle: title,
      modalMessage: message,
      confirmAction: action
    });
  }

  /**
   * 
   */
  private hideOptionPanel() {
    this.setState({
      modalShown: false
    });
  }

  /**
   * 
   */
  private onAdd() {
    const { onChange } = this.props;
    if (onChange) {
      const bodies = this.createBodies()
      bodies.push({
        position: '(0,0,0)'
      });
      onChange(bodies);
    }
  }

  /**
   * 
   * @param idx 
   */
  private onDelete(idx: number) {
    this.showOptionPanel(
      'Remove body #' + (idx + 1),
      'Body #' + (idx + 1) + ' will be removed from the list.',
      () => this.deleteBody(idx)
    );
  }

  /**
   * 
   * @param idx 
   */
  private deleteBody(idx: number) {
    const { onChange } = this.props;
    if (onChange) {
      const bodies = this.createBodies();
      bodies.splice(idx, 1);
      onChange(bodies);
    }
    this.hideOptionPanel();
  }

  /**
   * 
   */
  private createBodies(): BodyStructure<string>[] {
    return _.map(this.props.bodies, b => {
      return {
        position: b.position,
        rotation: b.rotation
      };
    });
  }

  /**
   * 
   * @param idx 
   * @param body 
   */
  private onChange(idx: number, body: BodyStructure<string>) {
    const { onChange } = this.props;
    if (onChange) {
      const bodies = this.createBodies();
      bodies[idx] = body;
      onChange(bodies);
    }
  }

  /**
   * 
   */
  render() {
    const { bodies, errors } = this.props;
    const { modalShown, modalTitle, modalMessage, confirmAction } = this.state;
    const rows = bodies ? _.map(bodies, (body, idx) =>
      <BodyRow key={idx} id={idx} body={body}
        errors={errors ? errors[idx] : undefined}
        onChange={(body) => this.onChange(idx, body)}
        onDelete={() => this.onDelete(idx)} />
    ) : [];
    return (
      <Accordion defaultActiveKey="0" >
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Bodies
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Button size="sm" variant="primary"
                onClick={() => this.onAdd()}>
                <FontAwesomeIcon icon={faPlus} />
              Add new body
            </Button>
              <hr></hr>
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Position</th>
                    <th scope="col">Rotation</th>
                    <th scope="col">Remove</th>
                  </tr>
                  {rows}
                </thead>
              </Table>
              <OptionPanel show={modalShown}
                title={modalTitle}
                message={modalMessage}
                confirmButton="Remove"
                onConfirm={() => { if (confirmAction) { confirmAction(); } }}
                onCancel={() => this.hideOptionPanel()}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion >
    );
  }
}
