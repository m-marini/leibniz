import React, { Component } from 'react';
import { FormGroup, InputGroup, FormControl, Button, HelpBlock, Glyphicon } from 'react-bootstrap';

class ExprField extends Component {

  handleInput(ev) {
    if (this.props.onChange) {
      this.props.onChange(ev.target.value);
    }
  }

  handleDelete() {
    if (this.props.onDelete) {
      this.props.onDelete();
    }
  }

  render() {
    const hasErrors = this.props.errors && this.props.errors.length > 0;
    const errorItems = this.props.errors.map((text, idx) => (<li key={idx}>{text}</li>));
    const validationState = hasErrors ? 'error' : 'success';
    const deleteBtn = !this.props.withoutDelete ?
      (<InputGroup.Button>
        <Button bsSize="small" bsStyle="danger" onClick={() => this.handleDelete()}>
          <Glyphicon glyph="trash" />
        </Button>
      </InputGroup.Button>)
      : '';

    return (
      <FormGroup bsSize="small" validationState={validationState}>
        <InputGroup>
          <InputGroup.Addon>{this.props.name}</InputGroup.Addon>
          <FormControl type="text" value={this.props.expr}
            onInput={(ev) => this.handleInput(ev)} onChange={() => { }} />
          {deleteBtn}
        </InputGroup>
        <HelpBlock>
          <ul>{errorItems}</ul>
        </HelpBlock>
      </FormGroup>
    );
  }
}

export { ExprField };
