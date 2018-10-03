import React, { Component } from 'react';
import { default as _ } from 'lodash';
import { Grid, Row, Form, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';

class DumpTable extends Component {

  thead(names) {
    return _.map(names, name => {
      return (
        <th key={name}>{name}</th>
      );
    });
  }

  createTableData(dumpData) {
    const colNames = _(dumpData[0]).keys().sortBy().value();
    const cells = _.map(dumpData, (row, idx) => {
      const cells = _.map(colNames, key => row[key].toString());
      cells.splice(0, 0, '' + (idx + 1));
      return cells;
    });
    return {
      names: colNames,
      cells: cells
    };
  }

  trow(row) {
    return _.map(row, (cell, i) => {
      return (
        <td key={i}>{cell}</td>
      );
    });
  }

  trows(cells) {
    return _.map(cells, (row, i) => {
      return (
        <tr key={i}>{this.trow(row)}</tr>
      );
    });
  }

  render() {
    const dumpData = this.props.dumpData;
    if (dumpData) {
      const tableData = this.createTableData(dumpData);
      return (
        <Table responsive>
          <thead>
            <tr>
              <th>Count</th>
              {this.thead(tableData.names)}
            </tr>
          </thead>
          <tbody >
            {this.trows(tableData.cells)}
          </tbody>
        </Table>
      );
    } else {
      return <Table responsive />
    }
  }
}

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
      return dumpTable;
    } else {
      return null;
    }
  }

  render() {
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
          </Form>
        </Row>
        <Row>
          <DumpTable dumpData={this.dumpData()} />
        </Row>
      </Grid>
    );
  }
}

export { DumpPanel };
