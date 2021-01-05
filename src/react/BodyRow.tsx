import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { ExprField } from './ExprField';
import { OptionPanel } from './OptionPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { BodyStructure, Errors } from '../modules/leibniz-defs';

interface BodyRowProps {
  id: number;
  body?: BodyStructure<string>;
  errors?: BodyStructure<Errors>;
  onChange?: (body: BodyStructure<string>) => void;
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
    const { onChange, body } = this.props;
    if (onChange && body) {
      onChange({
        position: body.position,
        rotation: '1+0*i'
      });
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
    const { onChange, body } = this.props;
    if (onChange && body) {
      onChange({ position: body.position });
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
    if (onChange && body) {
      onChange({
        position: value,
        rotation: body.rotation
      });
    }
  }

  /**
   * 
   * @param value 
   */
  private onChangeRotation(value: string) {
    const { onChange, body } = this.props;
    if (onChange && body) {
      onChange({
        position: body.position,
        rotation: value
      });
    }
  }

  render() {
    const { body, errors } = this.props;
    const rotField = body?.rotation ? (
      <div>
        <ExprField name=""
          expr={body.rotation} errors={errors?.rotation}
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
          <ExprField name="" expr={body?.position}
            errors={errors?.position}
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
