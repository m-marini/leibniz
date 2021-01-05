import { Quaternion, Vector3 } from 'babylonjs';
import _ from 'lodash';
import { ValueTypeCode, numberCode, expressionCodeGen, createCodeGenContext } from "../modules/leibnitz-codegen";
import { parse } from '../modules/leibniz-parser';
import { AnyValue, vector, matrix } from '../modules/leibniz-tensor';

describe('term code gen', () => {
    [{
        source: 'PI',
        result: { type: ValueTypeCode.Scalar },
        value: Math.PI,
    }, {
        source: 'e',
        result: { type: ValueTypeCode.Scalar },
        value: Math.E,
    }, {
        source: 'i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(1, 0, 0, 0)
    }, {
        source: 'j',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(0, 1, 0, 0)
    }, {
        source: 'k',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(0, 0, 1, 0)
    }, {
        source: 'ex',
        result: {
            type: ValueTypeCode.Vector,
            rows: 3
        },
        value: vector(1, 0, 0)
    }, {
        source: 'ey',
        result: {
            type: ValueTypeCode.Vector,
            rows: 3
        },
        value: vector(0, 1, 0)
    }, {
        source: 'dt',
        result: { type: ValueTypeCode.Scalar },
        value: 0.1
    }, {
        source: 'e0',
        result: {
            type: ValueTypeCode.Vector, rows: 1
        },
        value: vector(1)
    }, {
        source: 'e3',
        result: {
            type: ValueTypeCode.Vector, rows: 4
        },
        value: vector(0, 0, 0, 1)
    }, {
        source: 'I1',
        result: {
            type: ValueTypeCode.Matrix, rows: 1,
            cols: 1
        },
        value: matrix([[1]])
    }, {
        source: 'I4',
        result: {
            type: ValueTypeCode.Matrix, rows: 4,
            cols: 4
        },
        value: matrix([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ])
    }, {
        source: 'x',
        result: { type: ValueTypeCode.Scalar },
        value: 2
    }, {
        source: '2',
        result: { type: ValueTypeCode.Scalar },
        value: 2
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({ x: numberCode(2) });
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('pow code gen', () => {
    [{
        source: '2^2',
        result: { type: ValueTypeCode.Scalar },
        value: 4
    }, {
        source: '2^2^2',
        result: { type: ValueTypeCode.Scalar },
        value: 16
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({ x: numberCode(2) });
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('pow code gen errors', () => {
    [{
        source: 'i^2',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'ex^2',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'I2^2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: '2^i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: '2^ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: '2^I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'i^2',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'ex^2',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'I2^2',
        errors: ['scalar expected, matrix2x2 found']
    }].forEach(({ source, errors: expErrors }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({ x: numberCode(2) });
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const result = expressionCodeGen(ctx, ast);
            expect(result.errors).toEqual(expErrors);
        })
    });
});

describe('unary', () => {
    [{
        source: '+2',
        result: { type: ValueTypeCode.Scalar },
        value: 2
    }, {
        source: '-2',
        result: { type: ValueTypeCode.Scalar },
        value: -2
    }, {
        source: '--2',
        result: { type: ValueTypeCode.Scalar },
        value: 2
    }, {
        source: '-i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(-1, 0, 0, 0)
    }, {
        source: '-ex',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(-1, -0, -0)
    }, {
        source: '-I3',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [-1, -0, -0],
            [-0, -1, -0],
            [-0, -0, -1]
        ])
    }, {
        source: 'sin 1',
        result: { type: ValueTypeCode.Scalar },
        value: Math.sin(1)
    }, {
        source: 'cos 1',
        result: { type: ValueTypeCode.Scalar },
        value: Math.cos(1)
    }, {
        source: 'tan 1',
        result: { type: ValueTypeCode.Scalar },
        value: Math.tan(1)
    }, {
        source: 'asin 0.5',
        result: { type: ValueTypeCode.Scalar },
        value: Math.asin(0.5)
    }, {
        source: 'acos 0.5',
        result: { type: ValueTypeCode.Scalar },
        value: Math.acos(0.5)
    }, {
        source: 'atan 1',
        result: { type: ValueTypeCode.Scalar },
        value: Math.atan(1)
    }, {
        source: 'sinh 1',
        result: { type: ValueTypeCode.Scalar },
        value: Math.sinh(1)
    }, {
        source: 'cosh 1',
        result: { type: ValueTypeCode.Scalar },
        value: Math.cosh(1)
    }, {
        source: 'tanh 1',
        result: { type: ValueTypeCode.Scalar },
        value: Math.tanh(1)
    }, {
        source: 'exp 1',
        result: { type: ValueTypeCode.Scalar },
        value: Math.exp(1)
    }, {
        source: 'log 2',
        result: { type: ValueTypeCode.Scalar },
        value: Math.log(2)
    }, {
        source: 'log 2',
        result: { type: ValueTypeCode.Scalar },
        value: Math.log(2)
    }, {
        source: 'sqrt 3',
        result: { type: ValueTypeCode.Scalar },
        value: Math.sqrt(3)
    }, {
        source: 'T I2',
        result: {
            type: ValueTypeCode.Matrix,
            rows: 2,
            cols: 2
        },
        value: matrix([
            [1, 0],
            [0, 1]
        ])
    }, {
        source: 'qrot ex',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(Math.sin(0.5), 0, 0, Math.cos(0.5))
    }, {
        source: 'tr I2',
        result: { type: ValueTypeCode.Scalar },
        value: 2
    }, {
        source: 'n ex',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(1, 0, 0)
    }, {
        source: 'cyl ex',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(0, 1, 0)
    }, {
        source: 'cyl1 ex',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [1, -0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])
    }, {
        source: 'sphere ex',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(0, 0, 1)
    }, {
        source: 'sphere1 ex',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [0, 1, -0],
            [0, 1, 0],
            [1, -0, 0]
        ])
    }, {
        source: 'inv 2',
        result: { type: ValueTypeCode.Scalar },
        value: 0.5
    }, {
        source: 'inv i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(-1, -0, -0, 0)
    }, {
        source: 'inv I2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [1, 0],
            [0, 1]
        ])
    }, {
        source: 'det 1',
        result: { type: ValueTypeCode.Scalar },
        value: 1
    }, {
        source: 'det i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(1, 0, 0, 0)
    }, {
        source: 'det I2',
        result: { type: ValueTypeCode.Scalar },
        value: 1
    }, {
        source: 'min ex',
        result: { type: ValueTypeCode.Scalar },
        value: 0
    }, {
        source: 'min I2',
        result: { type: ValueTypeCode.Scalar },
        value: 0
    }, {
        source: 'max ex',
        result: { type: ValueTypeCode.Scalar },
        value: 1
    }, {
        source: 'max I2',
        result: { type: ValueTypeCode.Scalar },
        value: 1
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('unary error', () => {
    [{
        source: 'sin i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'sin ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'sin I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'cos i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'cos ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'cos I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'tan i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'tan ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'tan I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'asin i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'asin ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'asin I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'acos i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'acos ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'acos I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'atan i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'atan ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'atan I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'sinh i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'sinh ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'sinh I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'cosh i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'cosh ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'cosh I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'tanh i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'tanh ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'tanh I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'exp i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'exp ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'exp I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'log i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'log ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'log I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'sqrt i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'sqrt ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'sqrt I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'qrot 0',
        errors: ['vector3 expected, scalar found']
    }, {
        source: 'qrot i',
        errors: ['vector3 expected, quaternion found']
    }, {
        source: 'qrot e1',
        errors: ['vector3 expected, vector2 found']
    }, {
        source: 'qrot I2',
        errors: ['vector3 expected, matrix2x2 found']
    }, {
        source: 'tr 0',
        errors: ['square matrix expected, scalar found']
    }, {
        source: 'tr i',
        errors: ['square matrix expected, quaternion found']
    }, {
        source: 'tr ex',
        errors: ['square matrix expected, vector3 found']
    }, {
        source: 'n 0',
        errors: ['vector expected, scalar found']
    }, {
        source: 'n i',
        errors: ['vector expected, quaternion found']
    }, {
        source: 'n I2',
        errors: ['vector expected, matrix2x2 found']
    }, {
        source: 'cyl 0',
        errors: ['vector3 expected, scalar found']
    }, {
        source: 'cyl i',
        errors: ['vector3 expected, quaternion found']
    }, {
        source: 'cyl e1',
        errors: ['vector3 expected, vector2 found']
    }, {
        source: 'cyl I2',
        errors: ['vector3 expected, matrix2x2 found']
    }, {
        source: 'cyl1 0',
        errors: ['vector3 expected, scalar found']
    }, {
        source: 'cyl1 i',
        errors: ['vector3 expected, quaternion found']
    }, {
        source: 'cyl1 e1',
        errors: ['vector3 expected, vector2 found']
    }, {
        source: 'cyl1 I2',
        errors: ['vector3 expected, matrix2x2 found']
    }, {
        source: 'sphere 0',
        errors: ['vector3 expected, scalar found']
    }, {
        source: 'sphere i',
        errors: ['vector3 expected, quaternion found']
    }, {
        source: 'sphere e1',
        errors: ['vector3 expected, vector2 found']
    }, {
        source: 'sphere I2',
        errors: ['vector3 expected, matrix2x2 found']
    }, {
        source: 'sphere1 0',
        errors: ['vector3 expected, scalar found']
    }, {
        source: 'sphere1 i',
        errors: ['vector3 expected, quaternion found']
    }, {
        source: 'sphere1 e1',
        errors: ['vector3 expected, vector2 found']
    }, {
        source: 'sphere1 I2',
        errors: ['vector3 expected, matrix2x2 found']
    }, {
        source: 'inv ex',
        errors: ['not vector expected, vector3 found']
    }, {
        source: 'det ex',
        errors: ['square matrix expected, vector3 found']
    }, {
        source: 'min 0',
        errors: ['vector or matrix expected, scalar found']
    }, {
        source: 'min i',
        errors: ['vector or matrix expected, quaternion found']
    }, {
        source: 'max 0',
        errors: ['vector or matrix expected, scalar found']
    }, {
        source: 'max i',
        errors: ['vector or matrix expected, quaternion found']
    }].forEach(({ source, errors: expErrors }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const result = expressionCodeGen(ctx, ast);
            expect(result.errors).toEqual(expErrors);
        })
    });
});

describe('factor mul', () => {
    [{
        source: '2*3',
        result: { type: ValueTypeCode.Scalar },
        value: 6
    }, {
        source: '2*i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(2, 0, 0, 0)
    }, {
        source: '2*ex',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(2, 0, 0)
    }, {
        source: '2*I2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [2, 0],
            [0, 2]
        ])
    }, {
        source: 'i*2',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(2, 0, 0, 0)
    }, {
        source: 'i*i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(0, 0, 0, -1)
    }, {
        source: 'i*i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(0, 0, 0, -1)
    }, {
        source: 'ex*2',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(2, 0, 0)
    }, {
        source: 'ex*ex',
        result: { type: ValueTypeCode.Scalar },
        value: 1
    }, {
        source: 'I2*2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [2, 0],
            [0, 2]
        ])
    }, {
        source: 'I3*ex',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(1, 0, 0)
    }, {
        source: 'I2*ex',
        result: { type: ValueTypeCode.Vector, rows: 2 },
        value: vector(1, 0)
    }, {
        source: 'I4*ex',
        result: { type: ValueTypeCode.Vector, rows: 4 },
        value: vector(1, 0, 0, 0)
    }, {
        source: 'I2*I2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [1, 0],
            [0, 1]
        ])
    }, {
        source: 'I3*I2',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 2 },
        value: matrix([
            [1, 0],
            [0, 1],
            [0, 0]
        ])
    }, {
        source: 'I2*I3',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 3 },
        value: matrix([
            [1, 0, 0],
            [0, 1, 0]
        ])
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('factor mul error', () => {
    [{
        source: 'i*ex',
        errors: ['scalar or quaternion expected, vector3 found']
    }, {
        source: 'i*I2',
        errors: ['scalar or quaternion expected, matrix2x2 found']
    }, {
        source: 'ex*i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'ex*I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'I2*i',
        errors: ['not quaternion expected, quaternion found']
    }].forEach(({ source, errors: expErrors }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const result = expressionCodeGen(ctx, ast);
            expect(result.errors).toEqual(expErrors);
        })
    });
});

describe('factor div', () => {
    [{
        source: '2/3',
        result: { type: ValueTypeCode.Scalar },
        value: 2 / 3
    }, {
        source: '2/i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(-2, -0, -0, 0)
    }, {
        source: 'i/2',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(0.5, 0, 0, 0)
    }, {
        source: 'i/j',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(0, 0, -1, 0)
    }, {
        source: 'ex/2',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(0.5, 0, 0)
    }, {
        source: 'I2/2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [0.5, 0],
            [0, 0.5]
        ])
    }, {
        source: 'I2/I2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [1, 0],
            [0, 1]
        ])
    }, {
        source: 'I3/I2',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 2 },
        value: matrix([
            [1, 0],
            [0, 1],
            [0, 0]
        ])
    }, {
        source: 'I2/I3',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [1, 0],
            [0, 1]
        ])
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('factor div error', () => {
    [{
        source: 'i/ex',
        errors: ['scalar or quaternion expected, vector3 found']
    }, {
        source: 'i/I2',
        errors: ['scalar or quaternion expected, matrix2x2 found']
    }, {
        source: 'ex/i',
        errors: ['scalar expected, quaternion found']
    }, {
        source: 'ex/ex',
        errors: ['scalar expected, vector3 found']
    }, {
        source: 'ex/I2',
        errors: ['scalar expected, matrix2x2 found']
    }, {
        source: 'I2/i',
        errors: ['scalar or matrix expected, quaternion found']
    }, {
        source: 'I2/ex',
        errors: ['scalar or matrix expected, vector3 found']
    }].forEach(({ source, errors: expErrors }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const result = expressionCodeGen(ctx, ast);
            expect(result.errors).toEqual(expErrors);
        })
    });
});

describe('sum add', () => {
    [{
        source: '2+3',
        result: { type: ValueTypeCode.Scalar },
        value: 5
    }, {
        source: '2+i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(1, 0, 0, 2)
    }, {
        source: 'i+2',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(1, 0, 0, 2)
    }, {
        source: 'i+j',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(1, 1, 0, 0)
    }, {
        source: 'ex+ey',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(1, 1, 0)
    }, {
        source: 'e1+ey',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(0, 2, 0)
    }, {
        source: 'ey+e1',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(0, 2, 0)
    }, {
        source: 'I2+I2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [2, 0],
            [0, 2]
        ])
    }, {
        source: 'I3+I2',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 1]
        ])
    }, {
        source: 'I2+I3',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 1]
        ])
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('sum add error', () => {
    [{
        source: '1+ex',
        errors: ['scalar or quaternion expected, vector3 found']
    }, {
        source: '1+I2',
        errors: ['scalar or quaternion expected, matrix2x2 found']
    }, {
        source: 'i+ex',
        errors: ['scalar or quaternion expected, vector3 found']
    }, {
        source: 'i+I2',
        errors: ['scalar or quaternion expected, matrix2x2 found']
    }, {
        source: 'ex+1',
        errors: ['vector expected, scalar found']
    }, {
        source: 'ex+i',
        errors: ['vector expected, quaternion found']
    }, {
        source: 'ex+I2',
        errors: ['vector expected, matrix2x2 found']
    }, {
        source: 'I2+1',
        errors: ['matrix expected, scalar found']
    }, {
        source: 'I2+i',
        errors: ['matrix expected, quaternion found']
    }, {
        source: 'I2+ex',
        errors: ['matrix expected, vector3 found']
    }].forEach(({ source, errors: expErrors }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const result = expressionCodeGen(ctx, ast);
            expect(result.errors).toEqual(expErrors);
        })
    });
});

describe('sum sub', () => {
    [{
        source: '2-3',
        result: { type: ValueTypeCode.Scalar },
        value: -1
    }, {
        source: '2-i',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(-1, 0, 0, 2)
    }, {
        source: 'i-2',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(1, 0, 0, -2)
    }, {
        source: 'i-j',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(1, -1, 0, 0)
    }, {
        source: 'ex-ey',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(1, -1, 0)
    }, {
        source: 'ex-e2',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(1, 0, -1)
    }, {
        source: 'e2-ex',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(-1, 0, 1)
    }, {
        source: 'I2-I2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [0, 0],
            [0, 0]
        ])
    }, {
        source: 'I3-I2',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 1]
        ])
    }, {
        source: 'I2-I3',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, -1]
        ])
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('sum sub error', () => {
    [{
        source: '1-ex',
        errors: ['scalar or quaternion expected, vector3 found']
    }, {
        source: '1-I2',
        errors: ['scalar or quaternion expected, matrix2x2 found']
    }, {
        source: 'i-ex',
        errors: ['scalar or quaternion expected, vector3 found']
    }, {
        source: 'i-I2',
        errors: ['scalar or quaternion expected, matrix2x2 found']
    }, {
        source: 'ex-1',
        errors: ['vector expected, scalar found']
    }, {
        source: 'ex-i',
        errors: ['vector expected, quaternion found']
    }, {
        source: 'ex-I2',
        errors: ['vector expected, matrix2x2 found']
    }, {
        source: 'I2-1',
        errors: ['matrix expected, scalar found']
    }, {
        source: 'I2-i',
        errors: ['matrix expected, quaternion found']
    }, {
        source: 'I2-ex',
        errors: ['matrix expected, vector3 found']
    }].forEach(({ source, errors: expErrors }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const result = expressionCodeGen(ctx, ast);
            expect(result.errors).toEqual(expErrors);
        })
    });
});

describe('module', () => {
    [{
        source: '|2|',
        result: { type: ValueTypeCode.Scalar },
        value: 2
    }, {
        source: '|i|',
        result: { type: ValueTypeCode.Scalar },
        value: 1
    }, {
        source: '|ex|',
        result: { type: ValueTypeCode.Scalar },
        value: 1
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('module error', () => {
    [{
        source: '|I2|',
        errors: ['not matrix expected, matrix2x2 found']
    }].forEach(({ source, errors: expErrors }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const result = expressionCodeGen(ctx, ast);
            expect(result.errors).toEqual(expErrors);
        })
    });
});

describe('bracket', () => {
    [{
        source: '(2+3)*4',
        result: { type: ValueTypeCode.Scalar },
        value: 20
    }, {
        source: '4*(2+3)',
        result: { type: ValueTypeCode.Scalar },
        value: 20
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('complex', () => {
    [{
        source: 'i+2*j+3*k+4',
        result: { type: ValueTypeCode.Quaternion },
        value: new Quaternion(1, 2, 3, 4)
    }, {
        source: 'ex+2*ey+3*ez',
        result: { type: ValueTypeCode.Vector, rows: 3 },
        value: vector(1, 2, 3)
    }, {
        source: '((1,2),(3,4))*((4,3),(2,1))',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        value: matrix([
            [13, 5],
            [20, 8]
        ])
    }, {
        source: 'qrot ( ez )',
        result: { type: ValueTypeCode.Quaternion },
        value: Quaternion.RotationAxis(new Vector3(0, 0, 1), 1)
    }, {
        source: '|-2|',
        result: { type: ValueTypeCode.Scalar },
        value: 2
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('concat', () => {
    [{
        source: '1,2',
        result: { type: ValueTypeCode.Vector, rows: 2 },
        value: vector(1, 2)
    }, {
        source: '2,ex',
        result: { type: ValueTypeCode.Vector, rows: 4 },
        value: vector(2, 1, 0, 0)
    }, {
        source: 'ex,2',
        result: { type: ValueTypeCode.Vector, rows: 4 },
        value: vector(1, 0, 0, 2)
    }, {
        source: 'ex,ez',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 2 },
        value: matrix([
            [1, 0],
            [0, 0],
            [0, 1]
        ])
    }, {
        source: 'ex,e3',
        result: { type: ValueTypeCode.Matrix, rows: 4, cols: 2 },
        value: matrix([
            [1, 0],
            [0, 0],
            [0, 0],
            [0, 1]
        ])
    }, {
        source: 'ex,I3',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 4 },
        value: matrix([
            [1, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ])
    }, {
        source: 'ex,I4',
        result: { type: ValueTypeCode.Matrix, rows: 4, cols: 5 },
        value: matrix([
            [1, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1]
        ])
    }, {
        source: 'ex,I2',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [1, 1, 0],
            [0, 0, 1],
            [0, 0, 0],
        ])
    }, {
        source: 'I3,ex',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 4 },
        value: matrix([
            [1, 0, 0, 1],
            [0, 1, 0, 0],
            [0, 0, 1, 0]
        ])
    }, {
        source: 'I2,ex',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 3 },
        value: matrix([
            [1, 0, 1],
            [0, 1, 0],
            [0, 0, 0]
        ])
    }, {
        source: 'I4,ex',
        result: { type: ValueTypeCode.Matrix, rows: 4, cols: 5 },
        value: matrix([
            [1, 0, 0, 0, 1],
            [0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0]
        ])
    }, {
        source: 'I2,I2',
        result: { type: ValueTypeCode.Matrix, rows: 2, cols: 4 },
        value: matrix([
            [1, 0, 1, 0],
            [0, 1, 0, 1],
        ])
    }, {
        source: 'I3,I2',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 5 },
        value: matrix([
            [1, 0, 0, 1, 0],
            [0, 1, 0, 0, 1],
            [0, 0, 1, 0, 0]
        ])
    }, {
        source: 'I2,I3',
        result: { type: ValueTypeCode.Matrix, rows: 3, cols: 5 },
        value: matrix([
            [1, 0, 1, 0, 0],
            [0, 1, 0, 1, 0],
            [0, 0, 0, 0, 1]
        ])
    }].forEach(({ source, result: expResult, value: expValue }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const vars: Record<string, AnyValue> = { dt };
            const result = expressionCodeGen(ctx, ast);
            const value = result.typeCode.code(vars);
            expect(result.errors).toEqual([]);
            expect(result.typeCode).toMatchObject(expResult);
            expect(value).toEqual(expValue);
        })
    });
});

describe('concat error', () => {
    [{
        source: '1,i',
        errors: ['scalar or vector expected, quaternion found']
    }, {
        source: '1,I2',
        errors: ['scalar or vector expected, matrix2x2 found']
    }, {
        source: 'i,1',
        errors: ['quaternion cannot be concatenated, scalar found']
    }, {
        source: 'i,i',
        errors: ['quaternion cannot be concatenated, quaternion found']
    }, {
        source: 'i,ex',
        errors: ['quaternion cannot be concatenated, vector3 found']
    }, {
        source: 'i,I2',
        errors: ['quaternion cannot be concatenated, matrix2x2 found']
    }, {
        source: 'I2,1',
        errors: ['vector or matrix expected, scalar found']
    }, {
        source: 'I2,i',
        errors: ['vector or matrix expected, quaternion found']
    }].forEach(({ source, errors: expErrors }) => {
        test(`${source}`, () => {
            const ctx = createCodeGenContext({});
            const { ast, errors } = parse(source);
            expect(errors).toEqual([]);

            const dt = 0.1;
            const result = expressionCodeGen(ctx, ast);
            expect(result.errors).toEqual(expErrors);
        })
    });
});
