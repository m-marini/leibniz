import React, { FunctionComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * 
 * @param param0 
 */
export const OptionPanel: FunctionComponent<{
  show: boolean;
  title?: string;
  message?: string;
  confirmButton: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}> = ({ show, title, message, confirmButton, onCancel, onConfirm }) => {

  return (
    <Modal show={show}
      size="sm"
      onHide={() => { if (onCancel) { onCancel(); } }}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => { if (onCancel) { onCancel(); } }}>Cancel</Button>
        <Button variant="danger" onClick={() => { if (onConfirm) { onConfirm(); } }}>{confirmButton}</Button>
      </Modal.Footer>
    </Modal>
  );
}
