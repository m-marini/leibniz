import React, { Component } from 'react';
import { Button, Row, Form, Container } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { SystemRules } from '../modules/leibniz-defs';
import { generateData, toCsv } from '../modules/leibnitz-dumper';

interface DumpPanelProps {
  rules?: SystemRules;
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
    const { rules } = this.props;
    if (rules) {
      const { dt: dtString, counts: countsString } = this.state;
      const dt = parseFloat(dtString);
      const counts = parseInt(countsString);
      const data = generateData(rules, dt, counts);
      const dumpData = toCsv(data, rules);
      const blob = new Blob([dumpData], { type: "text/plain;charset=utf-8" });
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
    const { rules } = this.props;
    const dumpDisabled = rules === undefined;
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
