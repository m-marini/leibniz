import React, { Component } from 'react';
import { Panel, Button, Glyphicon, Table } from 'react-bootstrap';
import { default as _ } from 'lodash';
import { BodyRow } from './BodyRow';
import { OptionPanel } from './OptionPanel';

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
    const panelCtx = this.hasError() ? 'danger' : 'default';

    const rows = _.map(this.props.bodies, (body, idx) =>
      <BodyRow key={idx} id={idx} body={body}
        onChange={(body) => this.onChange(idx, body)}
        onDelete={() => this.onDelete(idx)} />
    );
    return (
      <Panel bsStyle={panelCtx} defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>
            Bodies
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Button bsSize="small" bsStyle="primary" onClick={() => this.onAdd()}>
              <Glyphicon glyph="plus" />
              Add new body
            </Button>
            <hr></hr>
            <Table striped condensed>
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
            <OptionPanel show={this.state.modalShown}
              title={this.state.modalTitle}
              message={this.state.modalMessage}
              confirmButton="Remove"
              onConfirm={() => this.state.confirmAction()}
              onCancel={() => this.hideOptionPanel()}
            />
          </Panel.Body >
        </Panel.Collapse>
      </Panel >
    );
  }
}

export { BodiesPanel };
