import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { ExprField } from './ExprField';
import { OptionPanel } from './OptionPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

export class BodyRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalShown: false
    };
  }

  onAddRotation() {
    if (this.props.onChange) {
      const body = {
        position: this.props.body.position.exp,
        rotation: '1+0*i'
      };
      this.props.onChange(body);
    }
  }

  showOptionPanel() {
    this.setState({ modalShown: true });
  }

  hideOptionPanel() {
    this.setState({ modalShown: false });
  }

  deleteRotation() {
    if (this.props.onChange) {
      const body = {
        position: this.props.body.position.exp
      };
      this.props.onChange(body);
    }
    this.hideOptionPanel();
  }

  onDeleteRow() {
    if (this.props.onDelete) {
      this.props.onDelete();
    }
  }

  onChangePosition(value) {
    if (this.props.onChange) {
      const body = (this.props.body.rotation) ?
        {
          position: value,
          rotation: this.props.body.rotation.exp
        } : {
          position: value
        };
      this.props.onChange(body);
    }
  }

  onChangeRotation(value) {
    if (this.props.onChange) {
      const body = {
        position: this.props.body.position.exp,
        rotation: value
      };
      this.props.onChange(body);
    }
  }

  render() {
    const {body} = this.props;
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
        <Button size="sm" variant="danger" onClick={() => this.onAddRotation()}>
          <FontAwesomeIcon icon={faPlus} >Add rotation</FontAwesomeIcon>
        </Button>);
    return (
      <tr>
        <td>{this.props.id + 1}</td>
        <td>
          <ExprField name="" expr={body.position.exp}
            errors={body.position.errors}
            onChange={(value) => this.onChangePosition(value)}
            withoutDelete="true"
          />
        </td>
        <td>
          {rotField}
        </td>
        <td>
          <Button size="sm" variant="danger" onClick={() => this.onDeleteRow()}>
            <FontAwesomeIcon icon={faTrash} >Remove body</FontAwesomeIcon>
          </Button>
        </td>
      </tr>
    );
  }
}
