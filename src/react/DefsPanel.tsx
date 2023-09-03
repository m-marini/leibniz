import React, { Component } from 'react';
import { InputGroup, Button, Form, Accordion } from 'react-bootstrap';
import { ExprField } from './ExprField';
import _ from 'lodash';
import { OptionPanel } from './OptionPanel';
import { v5 as uuidv5 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { identifierError } from '../modules/leibniz-parser';
import { Errors } from '../modules/leibniz-defs';

const ns = uuidv5('http://www.mmarini.org', uuidv5.URL);

interface DefsPanelProps {
  panelKey: string;
  title: string;
  defs?: Record<string, string>;
  errors?: Record<string, Errors>;
  onChange?: (id: string, value: Record<string, string>) => void;
};

/**
 * 
 */
export class DefsPanel extends Component<DefsPanelProps, {
  deleteModalShown: boolean;
  newName: string;
  modalTitle?: string;
  modalMessage?: string;
  optionAction?: () => void;
}>{

  /**
   * 
   * @param props 
   */
  constructor(props: DefsPanelProps) {
    super(props);
    this.state = {
      deleteModalShown: false,
      newName: ''
    };
  }

  /**
   * 
   * @param id 
   * @param value 
   */
  private onChange(id: string, value: string) {
    const { onChange, panelKey, defs } = this.props;
    if (onChange && defs) {
      const newConf = _.clone(defs);
      newConf[id] = value;
      onChange(panelKey, newConf);
    }
  }

  /**
   * 
   * @param id 
   */
  private onDelete(id: string) {
    this.showOptionPanel(
      'Remove "' + id + '" definition ?',
      'The definition "' + id + '" will be removed from the list.',
      () => this.deleteDefs(id));
  }

  /**
   * 
   * @param title 
   * @param message 
   * @param action 
   */
  private showOptionPanel(title: string, message: string, action: () => void) {
    this.setState({
      deleteModalShown: true,
      modalTitle: title,
      modalMessage: message,
      optionAction: action
    });
  }

  /**
   * 
   * @param id 
   */
  private deleteDefs(id: string) {
    const { onChange, panelKey, defs } = this.props;
    if (onChange && defs) {
      const newConf = _.omit(defs, id);
      onChange(panelKey, newConf);
    }
    this.hideOptionPanel();
  }

  /**
   * 
   */
  private hideOptionPanel() {
    this.setState({
      deleteModalShown: false
    });
  }

  /**
   * 
   */
  private onAdd() {
    const { onChange, panelKey, defs } = this.props;
    if (onChange && defs) {
      const { newName } = this.state;
      const newConf = _.clone(defs);
      newConf[newName] = '0';
      onChange(panelKey, newConf);
      this.setState({ newName: '' });
    }
  }

  /**
   * 
   * @param name 
   */
  onName(name: string) {
    this.setState({ newName: name });
  }

  /**
   * 
   * @param name 
   */
  newNameError(name: string) {
    const { defs } = this.props;
    if (name === '') {
      return 'Identifier is required';
    }
    const error = identifierError(name);
    if (error) {
      return error;
    }
    if (defs && defs[name] !== undefined) {
      return 'Definition already exists';
    }
    return '';
  }

  render() {
    const { title, defs, errors, panelKey } = this.props;
    const {
      deleteModalShown, modalTitle, modalMessage, optionAction,
      newName
    } = this.state;
    const newNameError = this.newNameError(newName);

    const fieldList = _(defs)
      .toPairs()
      .sortBy(ary => ary[0])
      .map(ary => {
        const key = ary[0];
        const value = ary[1];
        const id = uuidv5(key, ns);
        return { id, key, value };
      }).value();

    const hasNewNameError = newNameError !== ''
    return (
      <Accordion.Item eventKey={panelKey}>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
          <Form.Group controlId="validationAdd">
            <InputGroup size="sm" >
              <InputGroup.Text>Name</InputGroup.Text>
              <Form.Control type="text"
                value={newName}
                onChange={(ev) => this.onName(ev.target.value)}
                isValid={!hasNewNameError}
                isInvalid={!!hasNewNameError} />
              <InputGroup.Text>
                <Button variant="primary"
                  onClick={() => this.onAdd()}
                  disabled={hasNewNameError}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add definition</span>
                </Button>
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">{newNameError}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <hr></hr>
          {fieldList.map(({ id, key, value }) => (
            <ExprField key={id} name={key}
              expr={value}
              errors={errors ? errors[key] : undefined}
              onChange={(value) => this.onChange(key, value)}
              onDelete={() => this.onDelete(key)}></ExprField>
          ))}
          <OptionPanel show={deleteModalShown}
            title={modalTitle}
            message={modalMessage}
            confirmButton="Remove"
            onCancel={() => this.hideOptionPanel()}
            onConfirm={() => { if (optionAction) { optionAction(); } }}
          />
        </Accordion.Body>
      </Accordion.Item>
    );
  }
}
