import React, { Component } from 'react';
import { default as _ } from 'lodash';
import { Button, Row, Form, Container } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { System } from './Interpreter';

interface DumpPanelProps {
  result: System;
};

/**
 * 
 */
export class DumpPanel extends Component<DumpPanelProps, {
  counts: string;
  dt: string;
}> {

  /**
   * 
   * @param props 
   */
  constructor(props: DumpPanelProps) {
    super(props);
    this.state = {
      counts: '10',
      dt: '0.1'
    };
  }

  /**
   * 
   */
  private dumpData() {
    const { result } = this.props;
    const { dt: dtString, counts: countsString } = this.state;
    const dt = parseFloat(dtString);
    const counts = parseInt(countsString);
    var sys = result.system;
    if (sys) {
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

  /**
   * 
   * @param value 
   */
  private setCounts(value: string) {
    this.setState({ counts: value });
  }

  /**
   * 
   * @param value 
   */
  private setDt(value: string) {
    this.setState({ dt: value });
  }

  /**
   * 
   */
  render() {
    const { result } = this.props;
    const dumpDisabled = !result.system;
    return (
      <Container>
        <Row>
          <Form noValidate inline>
            <Form.Group controlId="formInlineName">
              <Form.Label>Counts</Form.Label>{' '}
              <Form.Control type="text" placeholder="Counts"
                onChange={ev => this.setCounts(ev.target.value)}
                value={this.state.counts} />
            </Form.Group>{' '}
            <Form.Group controlId="formInlineName" >
              <Form.Label>dt</Form.Label>{' '}
              <Form.Control type="text" placeholder="dt"
                onChange={ev => this.setDt(ev.target.value)}
                value={this.state.dt} />
            </Form.Group>
            <Button variant="primary"
              disabled={dumpDisabled}
              onClick={() => this.dumpData()} >Download</Button>
          </Form>
        </Row>
      </Container>
    );
  }
}
