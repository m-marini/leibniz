import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class OptionPanel extends Component {

  constructor(props) {
    super(props);
  }

  onHideModal() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  onConfirmModal() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }

  render() {
    return (
      <Modal bsSize="small" show={this.props.show} onHide={() => this.onHideModal()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
          <Modal.Body>{this.props.message}</Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={() => this.onHideModal()}>Cancel</Button>
            <Button bsStyle="danger" onClick={() => this.onConfirmModal()}>{this.props.confirmButton}</Button>
          </Modal.Footer>
        </Modal.Header>
      </Modal>
    );
  }
}

export { OptionPanel };
