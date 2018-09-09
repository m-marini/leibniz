import React, { Component } from 'react';
import { Button, Glyphicon, Modal } from 'react-bootstrap';
import { ExprField } from './ExprField';

class BodyRow extends Component {

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
        rotation: '1'
      };
      this.props.onChange(body);
    }
  }

  onDeleteRotation() {
    this.setState({ modalShown: true });
  }

  onCloseModal() {
    this.setState({ modalShown: false });
  }

  deleteRotation() {
    this.setState({ modalShown: false });
    if (this.props.onChange) {
      const body = {
        position: this.props.body.position.exp
      };
      this.props.onChange(body);
    }
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
    const rotField = this.props.body.rotation ? (
      <div>
        <ExprField name="Position" expr={this.props.body.rotation.exp} errors={this.props.body.rotation.errors}
          onChange={(value) => this.onChangeRotation(value)}
          onDelete={() => this.onDeleteRotation()}
        />
        <Modal bsSize="small" show={this.state.modalShown} onHide={() => this.onCloseModal()}>
          <Modal.Header closeButton>
            <Modal.Title>Remove rotation ?</Modal.Title>
            <Modal.Body>The rotation will be removed from body</Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" onClick={() => this.onCloseModal()}>Cancel</Button>
              <Button bsStyle="danger" onClick={() => this.deleteRotation()}>Remove</Button>
            </Modal.Footer>
          </Modal.Header>
        </Modal>
      </div>
    ) : (
        <Button bsSize="small" bsStyle="danger" onClick={() => this.onAddRotation()}>
          <Glyphicon glyph="plus" />
          Add rotation
      </Button>);
    return (
      <tr>
        <td>{this.props.id + 1}</td>
        <td>
          <ExprField name="Position" expr={this.props.body.position.exp}
            errors={this.props.body.position.errors}
            onChange={(value) => this.onChangePosition(value)}
            withoutDelete="true"
          />
        </td>
        <td>
          {rotField}
        </td>
        <td>
          <Button bsSize="small" bsStyle="danger" onClick={() => this.onDeleteRow()}>
            <Glyphicon glyph="trash" />
            Remove body
          </Button>
        </td>
      </tr>
    );
  }
}

export { BodyRow };
