import React, { FunctionComponent } from 'react';
import { InputGroup, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const ExprField: FunctionComponent<{
  name: string;
  expr?: string;
  errors?: string[];
  withoutDelete?: boolean;
  onChange?: (arg: string) => void;
  onDelete?: () => void;
}> = ({ name, expr, errors = [], withoutDelete = false, onDelete, onChange }) => {
  const hasErrors = errors.length > 0;
  const errorItems = errors.map((text, idx) => (<li key={idx}>{text}</li>));

  const deleteBtn = !withoutDelete ?
    (<InputGroup.Append>
      <Button variant="danger"
        onClick={() => { if (onDelete) { onDelete() } }}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </InputGroup.Append>)
    : '';

  return (
    <Form.Group >
      <InputGroup size="sm" >
        <InputGroup.Prepend>{name}</InputGroup.Prepend>
        <Form.Control type="text"
          value={expr}
          // onInput={(ev) => { if (onChange) { onChange(ev.target.value); } }}
          onChange={(ev) => { if (onChange) { onChange(ev.target.value); } }}
          isValid={!hasErrors}
          isInvalid={!!hasErrors} />
        {deleteBtn}
        <Form.Control.Feedback type="invalid">
          <ul>{errorItems}</ul>
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group >
  );
}
