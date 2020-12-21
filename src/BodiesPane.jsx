import React, { Component } from 'react';
import { Accordion, Button, Card, Table } from 'react-bootstrap';
import { default as _ } from 'lodash';
import { BodyRow } from './BodyRow';
import { OptionPanel } from './OptionPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class BodiesPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalShown: false
    };
  }

  showOptionPanel(title, message, action) {
    this.setState({
      modalShown: true,
      modalTitle: title,
      modalMessage: message,
      confirmAction: action
    });
  }

  hideOptionPanel() {
    this.setState({
      modalShown: false
    });
  }

  onAdd() {
    if (this.props.onChange) {
      const bodies = this.createBodies()
      bodies.push({
        position: '(0,0,0)'
      });
      this.props.onChange(bodies);
    }
  }

  onDelete(idx) {
    this.showOptionPanel(
      'Remove body #' + (idx + 1),
      'Body #' + (idx + 1) + ' will be removed from the list.',
      () => this.deleteBody(idx)
    );
  }

  deleteBody(idx) {
    if (this.props.onChange) {
      const bodies = this.createBodies();
      bodies.splice(idx, 1);
      this.props.onChange(bodies);
    }
    this.hideOptionPanel();
  }

  createBodies() {
    return _.map(this.props.bodies, b =>
      (b.rotation) ?
        {
          position: b.position.exp,
          rotation: b.rotation.exp
        } :
        {
          position: b.position.exp
        }
    );
  }

  onChange(idx, body) {
    if (this.props.onChange) {
      const bodies = this.createBodies();
      bodies[idx] = body;
      this.props.onChange(bodies);
    }
  }

  hasError() {
    return _.flatMap(this.props.bodies, e => {
      return e.rotation ? _.concat(e.position.errors, e.rotation.errors) : e.position.errors;
    }).length > 0;
  }

  render() {
    const { bodies } = this.props;
    const { modalShown, modalTitle, modalMessage, confirmAction } = this.state;
    const rows = _.map(bodies, (body, idx) =>
      <BodyRow key={idx} id={idx} body={body}
        onChange={(body) => this.onChange(idx, body)}
        onDelete={() => this.onDelete(idx)} />
    );
    return (
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Bodies
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Button size="sm" variant="primary"
                onClick={() => this.onAdd()}>
                <FontAwesomeIcon icon={faPlus} />
              Add new body
            </Button>
              <hr></hr>
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Position</th>
                    <th scope="col">Rotation</th>
                    <th scope="col"></th>
                  </tr>
                  {rows}
                </thead>
              </Table>
              <OptionPanel show={modalShown}
                title={modalTitle}
                message={modalMessage}
                confirmButton="Remove"
                onConfirm={() => confirmAction()}
                onCancel={() => this.hideOptionPanel()}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion >
    );
  }
}

export { BodiesPanel };
