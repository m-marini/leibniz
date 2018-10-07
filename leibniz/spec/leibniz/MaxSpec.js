
import { SystemParser, checkForIdentifier } from '../../src/leibniz-ast-0.1.1';

describe('A SystemParser1', function () {
  it('parses min reserver keyword', function () {
    const result = checkForIdentifier('max');
    expect(result).toEqual('Name "max" must not be a reserved keyword');
  });

  it('parses a min vars with value', function () {
    const conf = {
      vars: { a: 'max(2)' },
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

  it('parses a max vars with quaternion', function () {
    const conf = {
      vars: { a: 'max(i)' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([
      'Invalid max on quaternion'
    ]);
  });

  it('parses a max vars with vector', function () {
    const conf = {
      vars: { a: 'max(b)' },
      funcs: {b : '1,2'},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'ref b',
      'max vector'
    ]);
    expect(result.system._vars.a).toBeCloseTo(2);
  });

  it('parses a max vars with matrix', function () {
    const conf = {
      vars: { a: 'max(b)' },
      funcs: {b : '(1,2),(3,4)'},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'ref b',
      'max matrix'
    ]);
    expect(result.system._vars.a).toBeCloseTo(4);
  });
});
