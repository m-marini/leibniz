
import { SystemParser, checkForIdentifier } from './leibniz-ast-0.1.1';

describe('A SystemParser', function () {

  it('parses a mod vars with value', function () {
    const conf = {
      vars: { a: '|-2|' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'value 2',
      'negate value',
      'module'
    ]);
    expect(result.system._vars.a).toBeCloseTo(2);
  });

  it('parses a mod vars with quaternion', function () {
    const conf = {
      vars: { a: '|b|' },
      funcs: {b: '-i-j-k-1'},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'ref b',
      'quat module'
    ]);
    expect(result.system._vars.a).toBeCloseTo(2);
  });

  it('parses a mod vars with vector', function () {
    const conf = {
      vars: { a: '|b|' },
      funcs: {b:'-1,-1,-1,-1'},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([]);
    expect(result.parserState.vars.a.result.code.code).toEqual([
      'ref b',
      'vect module'
    ]);
    expect(result.system._vars.a).toBeCloseTo(2);
  });

  it('parses a mod vars with matrix', function () {
    const conf = {
      vars: { a: '|I2|' },
      funcs: {},
      update: {},
      bodies: []
    };
    const result = new SystemParser(conf).parse();
    expect(result.parserState.vars.a.errors).toEqual([
      'Invalid module operation on matrix'
    ]);
  });
});
