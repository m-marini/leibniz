import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { ExprField } from './ExprField';
import { OptionPanel } from './OptionPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { BodyDefinition } from './Definitions';
import { BodyNode } from './Interpreter';

interface BodyRowProps {
  id: number;
  body: BodyNode;
  onChange?: (body: BodyDefinition) => void;
  onDelete?: () => void;
};

export class BodyRow extends Component<BodyRowProps, {
  modalShown: boolean;
}> {

  constructor(props: BodyRowProps) {
    super(props);
    this.state = {
      modalShown: false
    };
  }

  /**
   * 
   */
  private onAddRotation() {
    const { onChange } = this.props;
    if (onChange) {
      const body = {
        position: this.props.body.position.exp,
        rotation: '1+0*i'
      };
      onChange(body);
    }
  }

  /**
   * 
   */
  showOptionPanel() {
    this.setState({ modalShown: true });
  }

  /**
   * 
   */
  hideOptionPanel() {
    this.setState({ modalShown: false });
  }

  /**
   * 
   */
  deleteRotation() {
    const { onChange } = this.props;
    if (onChange) {
      const body = {
        position: this.props.body.position.exp
      };
      onChange(body);
    }
    this.hideOptionPanel();
  }

  /**
   * 
   */
  onDeleteRow() {
    const { onDelete } = this.props;
    if (onDelete) {
      onDelete();
    }
  }

  /**
   * 
   * @param value 
   */
  private onChangePosition(value: string) {
    const { onChange, body } = this.props;
    if (onChange) {
      const newBody = (body.rotation) ?
        {
          position: value,
          rotation: body.rotation.exp
        } : {
          position: value
        };
      onChange(newBody);
    }
  }

  /**
   * 
   * @param value 
   */
  private onChangeRotation(value: string) {
    const { onChange, body } = this.props;
    if (onChange) {
      const newBody = {
        position: body.position.exp,
        rotation: value
      };
      onChange(newBody);
    }
  }

  render() {
    const { body } = this.props;
    const rotField = body.rotation ? (
      <div>
        <ExprField name=""
          expr={body.rotation.exp} errors={body.rotation.errors}
          onChange={(value) => this.onChangeRotation(value)}
          onDelete={() => this.showOptionPanel()}
        />
        <OptionPanel show={this.state.modalShown}
          title="Remove rotation ?"
          message="The rotation will be removed from body"
          confirmButton="Remove"
          onConfirm={() => this.deleteRotation()}
          onCancel={() => this.hideOptionPanel()}
        />
      </div>
    ) : (
        <Button size="sm" variant="primary" onClick={() => this.onAddRotation()}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>);
    return (
      <tr>
        <td>{this.props.id + 1}</td>
        <td>
          <ExprField name="" expr={body.position.exp}
            errors={body.position.errors}
            onChange={(value) => this.onChangePosition(value)}
            withoutDelete={true}
          />
        </td>
        <td>
          {rotField}
        </td>
        <td>
          <Button size="sm" variant="danger" onClick={() => this.onDeleteRow()}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </td>
      </tr>
    );
  }
}
