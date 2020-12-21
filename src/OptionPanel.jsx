import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * 
 */
export class OptionPanel extends Component {

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
    const { show, title, message } = this.props;
    return (
      <Modal show={show}
        size="sm"
        onHide={() => this.onHideModal()}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => this.onHideModal()}>Cancel</Button>
          <Button variant="danger" onClick={() => this.onConfirmModal()}>{this.props.confirmButton}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
