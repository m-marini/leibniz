import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface ImportFileProps {
  show: boolean;
  onCancel?: () => void
  onFileRead?: (arg: string | ArrayBuffer | null) => void;
  onError?: (arg: string) => void;
};

/**
 * 
 */
export class ImportFile extends Component<ImportFileProps, {}>{

  /**
   * 
   * @param file 
   */
  private onFileChange(file: Blob) {
    const { onFileRead, onError } = this.props;
    if (onFileRead) {
      const fr = new FileReader();
      fr.onload = (e) => {
        onFileRead(fr.result);
      };
      fr.onerror = (event) => {
        console.error(event);
        if (onError) {
          onError(event.toString());
        }
      };
      try {
        fr.readAsText(file);
      } catch (e) {
        console.error(e);
        if (onError) {
          onError('' + e);
        }
      }
    }
  }

  /**
   * 
   */
  render() {
    const { show, onCancel } = this.props;
    return (
      <Modal size="lg" show={show} onHide={() => { if (onCancel) { onCancel(); } }}>
        <Modal.Header closeButton>
          <Modal.Title>Import definitions from file ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The definitions will be imported from the selected file.</p>
          <Form>
            <Form.Group>
              <Form.Label>Import file</Form.Label>
              <Form.Control type="file"
                onChange={(ev: any) => this.onFileChange(ev.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { if (onCancel) { onCancel(); } }}>Cancel</Button>
        </Modal.Footer>
      </Modal >
    );
  }
}
