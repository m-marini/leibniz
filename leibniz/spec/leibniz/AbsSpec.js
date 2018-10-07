
import { SystemParser, checkForIdentifier } from '../../src/leibniz-ast-0.1.1';

describe('A SystemParser', function () {
  it('parses abs reserver keyword', function () {
    const result = checkForIdentifier('abs');
    expect(result).toEqual('Name "abs" must not be a reserved keyword');
  });

  it('parses a abs vars with value', function () {
    const conf = {
      vars: { a: 'abs(-2)' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2',
      'negate value',
      'abs'
    ]);
    expect(result.system._vars.a).toBeCloseTo(2);
  });

  it('parses a max vars with quaternion', function () {
    const conf = {
      vars: { a: 'abs(i)' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([
      'Invalid abs on quaternion'
    ]);
  });

  it('parses a max vars with vector', function () {
    const conf = {
      vars: { a: 'abs(ex)' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([
      'Invalid abs on vector'
    ]);
  });

  it('parses a max vars with matrix', function () {
    const conf = {
      vars: { a: 'abs(I2)' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([
      'Invalid abs on matrix'
    ]);
  });
});
