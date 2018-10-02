
import { SystemParser, checkForIdentifier } from '../../src/leibniz-ast-0.1.1';

describe('A SystemParser', function () {
  it('parses a invalid identifier', function () {
    const result = checkForIdentifier('0a');
    expect(result).toEqual('Name 0a must be an identifier');
  });

  it('parses a reserved keyword identifier', function () {
    const result = checkForIdentifier('E');
    expect(result).toEqual('Name E must not be a reserved keyword');
  });

  it('parses a I10 reserved keyword identifier', function () {
    const result = checkForIdentifier('I10');
    expect(result).toEqual('Name I10 must not be a reserved keyword');
  });

  it('parses a value expression returning the constant code', function () {
    const conf = {
      vars: {
        a: '0'
      },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual(['value 0']);
    expect(result.system._vars.a).toBeCloseTo(0);
  });

  it('parses a concat values expression returning the concat code', function () {
    const conf = {
      vars: {
        a: '1,2,3'
      },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 1',
      'value 2',
      'concat values',
      'value 3',
      'insert value at 2'
    ]);
    expect(result.system._vars.a.values[0][0]).toBeCloseTo(1);
    expect(result.system._vars.a.values[1][0]).toBeCloseTo(2);
    expect(result.system._vars.a.values[2][0]).toBeCloseTo(3);
  });

  it('parses a matrix build expression returning the matrix build code', function () {
    const conf = {
      vars: {
        a: '(1,2,3),(4,5,6),(7,8,9)'
      },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.system._vars.a.values[0][0]).toBeCloseTo(1);
    expect(result.system._vars.a.values[0][1]).toBeCloseTo(4);
    expect(result.system._vars.a.values[0][2]).toBeCloseTo(7);
    expect(result.system._vars.a.values[1][0]).toBeCloseTo(2);
    expect(result.system._vars.a.values[1][1]).toBeCloseTo(5);
    expect(result.system._vars.a.values[1][2]).toBeCloseTo(8);
    expect(result.system._vars.a.values[2][0]).toBeCloseTo(3);
    expect(result.system._vars.a.values[2][1]).toBeCloseTo(6);
    expect(result.system._vars.a.values[2][2]).toBeCloseTo(9);
  });

  it('parses a matrix build expression by function returning the matrix build code', function () {
    const conf = {
      vars: {
        a: 'a0'
      },
      funcs: {
        a0: 'T((1,2,3),(4,5,6),(7,8,9))'
      },
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.funcs.a0.errors).toEqual([]);
    expect(result.system._vars.a.values[0][0]).toBeCloseTo(1);
    expect(result.system._vars.a.values[0][1]).toBeCloseTo(2);
    expect(result.system._vars.a.values[0][2]).toBeCloseTo(3);
    expect(result.system._vars.a.values[1][0]).toBeCloseTo(4);
    expect(result.system._vars.a.values[1][1]).toBeCloseTo(5);
    expect(result.system._vars.a.values[1][2]).toBeCloseTo(6);
    expect(result.system._vars.a.values[2][0]).toBeCloseTo(7);
    expect(result.system._vars.a.values[2][1]).toBeCloseTo(8);
    expect(result.system._vars.a.values[2][2]).toBeCloseTo(9);
  });

  it('parses a matrix inverse expression by function returning the matrix inversion code', function () {
    const conf = {
      vars: {
        a: 'a0',
        b: 'inv(a)',
        c: 'a*b',
      },
      funcs: {
        a0: 'T((8,1,6),(3,5,7),(4,9,2))'
      },
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.b.errors).toEqual([]);
    expect(result.parserState.vars.c.errors).toEqual([]);
    expect(result.parserState.funcs.a0.errors).toEqual([]);

    expect(result.parserState.vars.a.result.code.code).toEqual([
      'ref a0'
    ]);
    expect(result.parserState.vars.b.result.code.code).toEqual([
      'ref a',
      'matrix inv',
    ]);
    expect(result.parserState.vars.c.result.code.code).toEqual([
      'ref a',
      'ref b',
      'multiply matrix',
    ]);

    expect(result.system._vars.a.values[0][0]).toBeCloseTo(8);
    expect(result.system._vars.a.values[0][1]).toBeCloseTo(1);
    expect(result.system._vars.a.values[0][2]).toBeCloseTo(6);
    expect(result.system._vars.a.values[1][0]).toBeCloseTo(3);
    expect(result.system._vars.a.values[1][1]).toBeCloseTo(5);
    expect(result.system._vars.a.values[1][2]).toBeCloseTo(7);
    expect(result.system._vars.a.values[2][0]).toBeCloseTo(4);
    expect(result.system._vars.a.values[2][1]).toBeCloseTo(9);
    expect(result.system._vars.a.values[2][2]).toBeCloseTo(2);

    expect(result.system._vars.b.values[0][0]).toBeCloseTo(0.1473);
    expect(result.system._vars.b.values[0][1]).toBeCloseTo(-0.1444);
    expect(result.system._vars.b.values[0][2]).toBeCloseTo(0.0638);
    expect(result.system._vars.b.values[1][0]).toBeCloseTo(-0.0611);
    expect(result.system._vars.b.values[1][1]).toBeCloseTo(0.0222);
    expect(result.system._vars.b.values[1][2]).toBeCloseTo(0.1056);
    expect(result.system._vars.b.values[2][0]).toBeCloseTo(-0.0194);
    expect(result.system._vars.b.values[2][1]).toBeCloseTo(0.1889);
    expect(result.system._vars.b.values[2][2]).toBeCloseTo(-0.1028);

    expect(result.system._vars.c.values[0][0]).toBeCloseTo(1);
    expect(result.system._vars.c.values[0][1]).toBeCloseTo(0);
    expect(result.system._vars.c.values[0][2]).toBeCloseTo(0);
    expect(result.system._vars.c.values[1][0]).toBeCloseTo(0);
    expect(result.system._vars.c.values[1][1]).toBeCloseTo(1);
    expect(result.system._vars.c.values[1][2]).toBeCloseTo(0);
    expect(result.system._vars.c.values[2][0]).toBeCloseTo(0);
    expect(result.system._vars.c.values[2][1]).toBeCloseTo(0);
    expect(result.system._vars.c.values[2][2]).toBeCloseTo(1);
  });

  it('parses an update with a var scalar must result an error', function () {
    const conf = {
      vars: { a: '0' },
      funcs: {},
      update: { a: 'i' },
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.update.a.errors).toEqual([
      'Update (quaternion) must be the same of var (scalar)'
    ]);
  });

  it('parses an update with a var quaternion must result an error', function () {
    const conf = {
      vars: { a: 'i' },
      funcs: {},
      update: { a: 'ex' },
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.update.a.errors).toEqual([
      'Update (vector [1]) must be the same of var (quaternion)'
    ]);
  });

  it('parses an update with a var vector must result an error', function () {
    const conf = {
      vars: { a: 'ex' },
      funcs: {},
      update: { a: 'I2' },
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.update.a.errors).toEqual([
      'Update (matrix [2, 2]) must be the same of var (vector [1])'
    ]);
  });

  it('parses an update with a var matrix must result an error', function () {
    const conf = {
      vars: { a: 'I2' },
      funcs: {},
      update: { a: '0' },
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.update.a.errors).toEqual([
      'Update (scalar) must be the same of var (matrix [2, 2])'
    ]);
  });

  it('parses a vars with simple power', function () {
    const conf = {
      vars: { a: '2^2' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2',
      'value 2',
      'power'
    ]);
    expect(result.system._vars.a).toBeCloseTo(4);
  });

  it('parses a vars with power of power', function () {
    const conf = {
      vars: { a: '2^2^2' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2',
      'value 2',
      'power',
      'value 2',
      'power'
    ]);
    expect(result.system._vars.a).toBeCloseTo(16);
  });

  it('parses a vars with sum of powers', function () {
    const conf = {
      vars: { a: '2^2+3^2' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2',
      'value 2',
      'power',
      'value 3',
      'value 2',
      'power',
      'add value'
    ]);
    expect(result.system._vars.a).toBeCloseTo(13);
  });

  it('parses a vars with prod of powers', function () {
    const conf = {
      vars: { a: '2^2*3^2' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2',
      'value 2',
      'power',
      'value 3',
      'value 2',
      'power',
      'multiply value'
    ]);
    expect(result.system._vars.a).toBeCloseTo(36);
  });

  it('parses a vars with powers of prod', function () {
    const conf = {
      vars: { a: '2^(3*4)' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2',
      'value 3',
      'value 4',
      'multiply value',
      'power'
    ]);
    expect(result.system._vars.a).toBeCloseTo(4096);
  });

  it('parses a vars with powers of macro', function () {
    const conf = {
      vars: { a: '2^b' },
      funcs: {b:'2'},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2',
      'ref b',
      'power'
    ]);
    expect(result.system._vars.a).toBeCloseTo(4);
  });
});
