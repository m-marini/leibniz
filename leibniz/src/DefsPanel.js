import React, { Component } from 'react';
import { Modal, FormGroup, FormControl, InputGroup, HelpBlock, Panel, Button, Glyphicon } from 'react-bootstrap';
import { ExprField } from './ExprField';
import { default as _ } from 'lodash';
const uuidv5 = require('uuid/v5');

const ns = uuidv5('http://www.mmarini.org', uuidv5.URL);
const idRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/g

class DefsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      deleteModalShown: false,
      newName: '',
      newNameError: 'Name required'
    };
  }

  createDefs() {
    return _.mapValues(this.props.defs, 'exp');
  }

  onChange(id, value) {
    if (this.props.onChange) {
      const newConf = this.createDefs()
      newConf[id] = value;
      this.props.onChange(this.props.panelKey, newConf);
    }
  }

  onDelete(id) {
    this.setState({
      deleteModalShown: true,
      modalTitle: 'Remove "' + id + '" definition ?',
      modalMessage: 'The definition "' + id + '" will be removed from the list.',
      deletingId: id
    });
  }

  deleteDefs() {
    this.setState({
      deleteModalShown: false
    });
    if (this.props.onChange) {
      const newConf = this.createDefs()
      delete newConf[this.state.deletingId];
      this.props.onChange(this.props.panelKey, newConf);
    }
  }

  abortDelete() {
    this.setState({
      deleteModalShown: false
    });
  }

  onAdd() {
    if (this.props.onChange) {
      const newConf = this.createDefs()
      newConf[this.state.newName] = '0';
      this.props.onChange(this.props.panelKey, newConf);
    }
  }

  onName(name) {
    const state = { newName: name };
    if (name === '') {
      state.newNameError = 'Name required';
    } else if (!name.match(idRegex)) {
      state.newNameError = 'Wrong name';
    } else if (this.props.defs[name]) {
      state.newNameError = 'Definition already exists';
    } else {
      state.newNameError = '';
    }
    this.setState(state);
  }

  hasError() {
    return _.flatMap(this.props.defs, 'errors').length > 0;
  }

  render() {
    const panelCtx = this.hasError() ? 'danger' : 'default';
    const fieldList = _(this.props.defs)
      .toPairs()
      .sortBy(ary => ary[0])
      .map(ary => {
        const key = ary[0];
        const value = ary[1];
        const id = uuidv5(key, ns);
        return (
          <ExprField key={id} name={key}
            expr={value.exp}
            errors={value.errors}
            onChange={(value) => this.onChange(key, value)}
            onDelete={() => this.onDelete(key)}></ExprField>
        );
      }).value();

    const hasNewNameError = this.state.newNameError !== ''
    const validationState = hasNewNameError ? 'error' : 'success';
    return (
      <Panel bsStyle={panelCtx} defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>
            {this.props.title}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <FormGroup bsSize="small" validationState={validationState}>
              <InputGroup>
                <InputGroup.Addon>Name</InputGroup.Addon>
                <FormControl type="text" value={this.state.newName} onInput={(ev) => this.onName(ev.target.value)}
                  onChange={() => { }} />
                <InputGroup.Button>
                  <Button bsSize="small" bsStyle="primary" onClick={() => this.onAdd()} disabled={hasNewNameError}>
                    <Glyphicon glyph="plus" />
                    <span>Add definition</span>
                  </Button>
                </InputGroup.Button>
              </InputGroup>
              <HelpBlock>{this.state.newNameError}</HelpBlock>
            </FormGroup>
            <hr></hr>
            {fieldList}
            <Modal bsSize="small" show={this.state.deleteModalShown} onHide={() => this.abortDelete()}>
              <Modal.Header closeButton>
                <Modal.Title>{this.state.modalTitle}</Modal.Title>
                <Modal.Body>{this.state.modalMessage}</Modal.Body>
                <Modal.Footer>
                  <Button bsStyle="primary" onClick={() => this.abortDelete()}>Cancel</Button>
                  <Button bsStyle="danger" onClick={() => this.deleteDefs()}>Remove</Button>
                </Modal.Footer>
              </Modal.Header>
            </Modal>
          </Panel.Body >
        </Panel.Collapse>
      </Panel >
    );
  }
}

export { DefsPanel };
