
import { SystemParser, checkForIdentifier } from './leibniz-ast-0.1.1';

describe('A SystemParser1', function () {
  it('parses min reserver keyword', function () {
    const result = checkForIdentifier('min');
    expect(result).toEqual('Name "min" must not be a reserved keyword');
  });

  it('parses a min vars with value', function () {
    const conf = {
      vars: { a: 'min(2)' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2'
    ]);
    expect(result.system._vars.a).toBeCloseTo(2);
  });

  it('parses a min vars with quaternion', function () {
    const conf = {
      vars: { a: 'min(i)' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([
      'Invalid min on quaternion'
    ]);
  });

  it('parses a min vars with vector', function () {
    const conf = {
      vars: { a: 'min(b)' },
      funcs: {b : '1,2'},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'ref b',
      'min vector'
    ]);
    expect(result.system._vars.a).toBeCloseTo(1);
  });

  it('parses a min vars with matrix', function () {
    const conf = {
      vars: { a: 'min(b)' },
      funcs: {b : '(1,2),(3,4)'},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'ref b',
      'min matrix'
    ]);
    expect(result.system._vars.a).toBeCloseTo(1);
  });
});
