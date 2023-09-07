/*
MIT License

Copyright (c) 2018 Marco Marini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React, { Component } from 'react';
import { Button, Row, Form, Container, Table } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { generateData, DataTable, tableToString } from '../modules/leibnitz-dumper';
import { SystemRules } from '../modules/leibniz-defs';

interface DumpPanelProps {
  rules?: SystemRules;
};

interface DumpPanelState {
  count: string;
  dt: string;
};

/**
 * 
 */
export class DumpPanel extends Component<DumpPanelProps, DumpPanelState> {

  /**
   * 
   * @param props 
   */
  constructor(props: DumpPanelProps) {
    super(props);
    this.state = {
      count: '10',
      dt: '0.1'
    };
  }

  /**
   * 
   */
  private generateData(): DataTable | undefined {
    const { count, dt } = this.state;
    const { rules } = this.props;
    if (rules) {
      const dtNum = parseFloat(dt);
      const countNum = parseInt(count);
      return generateData(rules, dtNum, countNum);
    } else {
      return undefined;
    }
  }

  /**
   * Dumps the data to file
   */
  private dumpData(data: DataTable | undefined) {
    if (data) {
      const blob = new Blob([tableToString(data)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "dump.csv");
    }
  }

  /**
   * Sets the count value
   * @param value the count value
   */
  private setCounts(value: string) {
    this.setState({ count: value });
  }

  /**
   * Sets the dt value
   * @param value the dt value
   */
  private setDt(value: string) {
    this.setState({ dt: value });
  }

  /**
   * 
   */
  render() {
    const data = this.generateData();
    const format = new Intl.NumberFormat('en-IN', {
      notation: "engineering",
      maximumSignificantDigits: 3

    });
    return (
      <Container>
        <Row>
          <Form noValidate>
            <Form.Group controlId="formInlineName">
              <Form.Label>Counts</Form.Label>{' '}
              <Form.Control type="text" placeholder="Counts"
                onChange={ev => this.setCounts(ev.target.value)}
                value={this.state.count} />
            </Form.Group>{' '}
            <Form.Group controlId="formInlineName" >
              <Form.Label>dt</Form.Label>{' '}
              <Form.Control type="text" placeholder="dt"
                onChange={ev => this.setDt(ev.target.value)}
                value={this.state.dt} />
            </Form.Group>
            <Button variant="primary"
              disabled={data === undefined}
              onClick={() => this.dumpData(data)} >Download</Button>
          </Form>
        </Row>
        {data ?
          (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  {data.headers.map((colName, i) => (
                    <th key={i}>{colName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.cells.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{format.format(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <></>
          )}
      </Container >
    );
  }
}
