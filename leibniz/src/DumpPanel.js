import React, { Component } from 'react';
import { default as _ } from 'lodash';
import { Button, Grid, Row, Form, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
import { saveAs } from 'file-saver/FileSaver';

class DumpPanel extends Component {

  constructor(props) {
    super();
    this.state = {
      counts: '10',
      dt: '0.1'
    };
  }

  dumpData() {
    var sys = this.props.result.system;
    if (sys) {
      const dt = parseFloat(this.state.dt);
      const counts = parseInt(this.state.counts);
      const dumpTable = [];
      for (var i = 0; i < counts; i++) {
        dumpTable.push(sys.dumpWithDt(dt));
        sys = sys.next(dt);
      }
      const keys = _(dumpTable[0]).keys().sortBy().value();
      const header = _.reduce(keys, (a, b) => a + ',' + b) + '\n\r';
      const rows = _(dumpTable).map(row =>
        _(keys).map(k =>
          '"' + row[k].toString() + '"').reduce((a, b) => a + ',' + b)
      ).reduce((a, b) => a + '\n\r' + b) + '\n\r';
      const blob = new Blob([header + rows], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "dump.csv");
    }
  }

  setCounts(value) {
    this.setState({ counts: value });
  }

  setDt(value) {
    this.setState({ dt: value });
  }
  
  render() {
    const dumpDisabled = !this.props.result.system;
    return (
      <Grid>
        <Row>
          <Form inline>
            <FormGroup controlId="formInlineName" bsSize="sm">
              <ControlLabel>Counts</ControlLabel>{' '}
              <FormControl type="text" placeholder="Counts"
                onInput={ev => this.setCounts(ev.target.value)}
                onChange={() => { }}
                value={this.state.counts} />
            </FormGroup>{' '}
            <FormGroup controlId="formInlineName" bsSize="sm">
              <ControlLabel>dt</ControlLabel>{' '}
              <FormControl type="text" placeholder="dt"
               onInput={ev => this.setDt(ev.target.value)}
               onChange={() => { }}
               value={this.state.dt} />
           </FormGroup>
            <Button bsStyle="primary"
              disabled={dumpDisabled}
              onClick={() => this.dumpData()} >Download</Button>
          </Form>
        </Row>
      </Grid>
    );
  }
}

export { DumpPanel };
