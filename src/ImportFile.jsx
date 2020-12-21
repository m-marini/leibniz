import React, { Component } from 'react';
import { FormControl, Modal, Button } from 'react-bootstrap';

/**
 * 
 */
export class ImportFile extends Component {

  onFileChange(file) {
    if (this.props.onFileRead) {
      const fr = new FileReader();
      fr.onload = (e) => {
        this.props.onFileRead(fr.result);
      };
      fr.onerror = (event) => {
        console.error(event);
        if (this.props.onError) {
          this.props.onError(event);
        }
      };
      try {
        fr.readAsText(file);
      } catch (e) {
        console.error(e);
        if (this.props.onError) {
          this.props.onError(e);
        }
      }
    }
  }

  onHideModal() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  render() {
    return (
      <Modal bsSize="small" show={this.props.show} onHide={() => this.onHideModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Import definitions from file ?</Modal.Title>
          <Modal.Body>
            <p>The definitions will be imported from the selected file.</p>
            <FormControl
              id="formControlsFile"
              type="file"
              label="Import file"
              help="Select file to import."
              onChange={(ev) => this.onFileChange(ev.target.files[0])}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={() => this.onHideModal()}>Cancel</Button>
          </Modal.Footer>
        </Modal.Header>
      </Modal >
    );
  }
}
