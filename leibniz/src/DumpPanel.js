import React, { Component } from 'react';
import { default as _ } from 'lodash';
import { Button, Grid, Row, Form, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
import { saveAs } from 'file-saver/FileSaver';

class DumpPanel extends Component {

  dumpData() {
    var sys = this.props.result.system;
    const dt = 1;
    if (sys) {
      const dumpTable = [];
      for (var i = 0; i < 10; i++) {
        dumpTable.push(sys.dumpWithDt(dt));
        sys = sys.next(dt);
      }
      const keys = _(dumpTable[0]).keys().sortBy().value();
      const header = _.reduce(keys, (a, b) => a + ',' + b) + '\n\r';
      const blob = new Blob([header], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "dump.csv");
    }
  }

  render() {
    const dumpDisabled = !this.props.result.system;
    return (
      <Grid>
        <Row>
          <Form inline>
            <FormGroup controlId="formInlineName" bsSize="sm">
              <ControlLabel>Counts</ControlLabel>{' '}
              <FormControl type="text" placeholder="Counts" />
            </FormGroup>{' '}
            <FormGroup controlId="formInlineName" bsSize="sm">
              <ControlLabel>dt</ControlLabel>{' '}
              <FormControl type="text" placeholder="dt" />
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
