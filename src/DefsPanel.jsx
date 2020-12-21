import React, { Component } from 'react';
import { InputGroup, Button, Card, Form, Accordion } from 'react-bootstrap';
import { ExprField } from './ExprField';
import { default as _ } from 'lodash';
import { OptionPanel } from './OptionPanel';
import { checkForIdentifier } from './leibniz-ast-0.1.1';
import { v5 as uuidv5 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const ns = uuidv5('http://www.mmarini.org', uuidv5.URL);
//const idRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/g

export class DefsPanel extends Component {

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
    const { onChange, panelKey } = this.props;
    if (onChange) {
      const newConf = this.createDefs()
      newConf[id] = value;
      onChange(panelKey, newConf);
    }
  }

  onDelete(id) {
    this.showOptionPanel(
      'Remove "' + id + '" definition ?',
      'The definition "' + id + '" will be removed from the list.',
      () => this.deleteDefs(id));
  }

  showOptionPanel(title, message, action) {
    this.setState({
      deleteModalShown: true,
      modalTitle: title,
      modalMessage: message,
      optionAction: action
    });
  }

  deleteDefs(id) {
    const { onChange, panelKey } = this.props;
    if (onChange) {
      const newConf = this.createDefs()
      delete newConf[id];
      onChange(panelKey, newConf);
    }
    this.hideOptionPanel();
  }

  hideOptionPanel() {
    this.setState({
      deleteModalShown: false
    });
  }

  onAdd() {
    const { onChange, panelKey } = this.props;
    if (onChange) {
      const newConf = this.createDefs();
      newConf[this.state.newName] = '0';
      onChange(panelKey, newConf);
    }
  }

  onName(name) {
    const state = { newName: name };
    if (name === '') {
      state.newNameError = 'Identifier is required';
    } else if (checkForIdentifier(name)) {
      state.newNameError = checkForIdentifier(name);
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
    const { title, defs } = this.props;
    const {
      deleteModalShown, modalTitle, modalMessage, optionAction,
      newName, newNameError
    } = this.state;

    const fieldList = _(defs)
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

    const hasNewNameError = newNameError !== ''
    return (
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            {title}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Form.Group size="small">
                <InputGroup size="sm" >
                  <InputGroup.Prepend>Name</InputGroup.Prepend>
                  <Form.Control type="text"
                    value={newName}
                    onChange={(ev) => this.onName(ev.target.value)}
                    isInvalid={!!hasNewNameError} />
                  <InputGroup.Append>
                    <Button variation="primary"
                      onClick={() => this.onAdd()}
                      disabled={hasNewNameError}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add definition</span>
                    </Button>
                  </InputGroup.Append>
                  <Form.Control.Feedback type="invalid">{newNameError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <hr></hr>
              {fieldList}
              <OptionPanel show={deleteModalShown}
                title={modalTitle}
                message={modalMessage}
                confirmButton="Remove"
                onCancel={() => this.hideOptionPanel()}
                onConfirm={() => optionAction()}
              />
            </Card.Body >
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}
