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

import { Quaternion, Vector3 } from "@babylonjs/core";
import { InternalStatus, ValueFunction } from "./leibniz-defs";
import { AnyValue, isMatrix, isNumber, isQuaternion, Matrix, vector } from "./leibniz-tensor";

/**
 * 
 */
function isTracing() {
    return false;
}

function tracing(f: () => string) {
    if (isTracing()) { console.log(f()); }
}

/**
 * 
 * @param value 
 */
export function createConstantCode<T extends AnyValue>(value: T): ValueFunction<T> {
    return (status: InternalStatus) => {
        tracing(() => `get value ${value}`);
        return value;
    };
}

/**
 * 
 * @param id 
 */
export function createNumberRefCode(id: string): ValueFunction<number> {
    return (status: InternalStatus) => {
        const value = status[id];
        if (value === undefined) {
            throw new Error(`Reference ${id} not defined`);
        }
        if (!isNumber(value)) {
            throw new Error(`Reference ${id} is not a number`);
        }
        tracing(() => `get ${id} = ${value}`);
        return value;
    };
}

/**
 * 
 * @param id 
 */
export function createQuaternionRefCode(id: string): ValueFunction<Quaternion> {
    return (status: InternalStatus) => {
        const value = status[id];
        if (value === undefined) {
            throw new Error(`Reference ${id} not defined`);
        }
        if (!isQuaternion(value)) {
            throw new Error(`Reference ${id} is not a number`);
        }
        tracing(() => `get ${id} = ${value}`);
        return value;
    };
}

export function createMatrixRefCode(id: string): ValueFunction<Matrix> {
    return (status: InternalStatus) => {
        const value = status[id];
        if (value === undefined) {
            throw new Error(`Reference ${id} not defined`);
        }
        if (!isMatrix(value)) {
            throw new Error(`Reference ${id} is not a number`);
        }
        tracing(() => `get ${id} = ${value}`);
        return value;
    };
}

/**
 * 
 * @param base 
 * @param exp 
 */
export function createPowCode(base: ValueFunction<number>, exp: ValueFunction<number>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const b = base(ctx);
        const e = exp(ctx)
        const result = Math.pow(b, e);
        tracing(() => `pow ${b} by ${e} =  ${result}`);
        return result;
    }
}

/**
 * 
 * @param base 
 */
export function createNegScalarCode(base: ValueFunction<number>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const x = base(ctx);
        const result = -x;
        tracing(() => `neg ${x} = ${result}`);
        return result;
    }
}

/**
 * 
 * @param base 
 */
export function createNegQuaternionCode(base: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const x = base(ctx)
        const result = Quaternion.Zero().subtract(x);
        tracing(() => `neg ${x} = ${result}`);
        return result;
    }
}

/**
 * 
 * @param base 
 */
export function createNegMatrixCode(base: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const x = base(ctx)
        const result = x.negate();
        tracing(() => `neg ${x} = ${result}`);
        return result;
    }
}

/**
 * 
 * @param base 
 * @param f 
 */
export function createScalarFunctionCode(base: ValueFunction<number>, f: (arg: number) => number): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const x = base(ctx)
        const result = f(base(ctx));
        tracing(() => `function ${f} of ${x} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createTransposeCode(base: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const x = base(ctx)
        const result = x.transpose();
        tracing(() => `transpose ${x} =${result}`);
        return result;
    }
}

/**
 * 
 * @param base 
 */
export function createQRotCode(base: ValueFunction<Matrix>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const x = base(ctx)
        const result = x.qrot();
        tracing(() => `qRot ${x} =${result}`);
        return result;
    }
}

/**
 * 
 * @param base 
 */
export function createTrCode(base: ValueFunction<Matrix>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const x = base(ctx)
        const result = x.trace();
        tracing(() => `trace ${x} =${result}`);
        return result;
    }
}

/**
 * 
 * @param base 
 */
export function createNormalCode(base: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.norma();
        tracing(() => `norma ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createCylCode(base: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.cyl();
        tracing(() => `cyl ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createCyl1Code(base: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.cyl1();
        tracing(() => `cyl1 ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createSphereCode(base: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.sphere();
        tracing(() => `sphere ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createSphere1Code(base: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.sphere1();
        tracing(() => `sphere1 ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createScalarInvCode(base: ValueFunction<number>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = 1 / v;
        tracing(() => `inverse ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createQuaternionInvCode(base: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = Quaternion.Inverse(v);
        tracing(() => `inverse ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createMatrixInvCode(base: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.inverse();
        tracing(() => `inverse ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createDetCode(base: ValueFunction<Matrix>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.det();
        tracing(() => `det ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createMinCode(base: ValueFunction<Matrix>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.min();
        tracing(() => `min ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param base 
 */
export function createMaxCode(base: ValueFunction<Matrix>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const v = base(ctx);
        const result = v.max();
        tracing(() => `max ${v} =${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createMulSSCode(a: ValueFunction<number>, b: ValueFunction<number>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av * bv;
        tracing(() => `mul ${av} * ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createMulSQCode(a: ValueFunction<number>, b: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = bv.scale(av);
        tracing(() => `mul ${av} * ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createMulSMCode(a: ValueFunction<number>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = bv.scale(av);
        tracing(() => `mul ${av} * ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createMulQQCode(a: ValueFunction<Quaternion>, b: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.multiply(bv);
        tracing(() => `mul ${av} * ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createMulQMCode(a: ValueFunction<Quaternion>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const bv3d = new Vector3(bv.get(0), bv.get(1), bv.get(2));
        const result = bv3d.rotateByQuaternionToRef(av, new Vector3());
        tracing(() => `mul ${av} * ${bv} = ${result}`);
        return vector(result._x, result._y, result._z);
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createScalarMulCode(a: ValueFunction<Matrix>, b: ValueFunction<Matrix>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.dot(bv);
        tracing(() => `mul ${av} * ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createMulMMCode(a: ValueFunction<Matrix>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.multiply(bv);
        tracing(() => `mul ${av} * ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createCrossCode(a: ValueFunction<Matrix>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.cross(bv);
        tracing(() => `${av} @ ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createDivSSCode(a: ValueFunction<number>, b: ValueFunction<number>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av / bv;
        tracing(() => `div ${av} / ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createDivSQCode(a: ValueFunction<number>, b: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = Quaternion.Inverse(bv).scale(av)
        tracing(() => `div ${av} / ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createDivQSCode(a: ValueFunction<Quaternion>, b: ValueFunction<number>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.scale(1 / bv);
        tracing(() => `div ${av} / ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createDivQQCode(a: ValueFunction<Quaternion>, b: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.multiply(Quaternion.Inverse(bv));
        tracing(() => `div ${av} / ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createDivMSCode(a: ValueFunction<Matrix>, b: ValueFunction<number>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.divide(bv);
        tracing(() => `div ${av} / ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createDivMMCode(a: ValueFunction<Matrix>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.multiply(bv.inverse());
        tracing(() => `div ${av} / ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createAddSSCode(a: ValueFunction<number>, b: ValueFunction<number>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av + bv;
        tracing(() => `add ${av} + ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createAddSQCode(a: ValueFunction<number>, b: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = bv.add(Quaternion.Identity().scale(av));
        tracing(() => `add ${av} + ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createAddQQCode(a: ValueFunction<Quaternion>, b: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.add(bv);
        tracing(() => `add ${av} + ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createAddMMCode(a: ValueFunction<Matrix>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.add(bv);
        tracing(() => `add ${av} + ${bv} = ${result}`);
        return result;
    };
}


/**
 * 
 * @param a 
 * @param b 
 */
export function createSubSSCode(a: ValueFunction<number>, b: ValueFunction<number>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av - bv;
        tracing(() => `sub ${av} - ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createSubSQCode(a: ValueFunction<number>, b: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = Quaternion.Identity().scale(av).subtract(bv);
        tracing(() => `sub ${av} - ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createSubQSCode(a: ValueFunction<Quaternion>, b: ValueFunction<number>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.subtract(Quaternion.Identity().scale(bv));
        tracing(() => `sub ${av} - ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createSubQQCode(a: ValueFunction<Quaternion>, b: ValueFunction<Quaternion>): ValueFunction<Quaternion> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.subtract(bv);
        tracing(() => `sub ${av} - ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createSubMMCode(a: ValueFunction<Matrix>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.subtract(bv);
        tracing(() => `sub ${av} - ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 */
export function createModScalarCode(a: ValueFunction<number>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const result = Math.abs(av);
        tracing(() => `module ${av} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 */
export function createModQuaternionCode(a: ValueFunction<Quaternion>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const result = av.length();
        tracing(() => `module ${av} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 */
export function createModVectorCode(a: ValueFunction<Matrix>): ValueFunction<number> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const result = av.module();
        tracing(() => `module ${av} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createConcatSS(a: ValueFunction<number>, b: ValueFunction<number>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = vector(av, bv);
        tracing(() => `concat ${av}, ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createInsertCode(a: ValueFunction<number>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = bv.insertAt(0, av);
        tracing(() => `concat ${av}, ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createAppendScalarCode(a: ValueFunction<Matrix>, b: ValueFunction<number>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.insertAt(av.rows, bv);
        tracing(() => `concat ${av}, ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param b 
 */
export function createAppendCode(a: ValueFunction<Matrix>, b: ValueFunction<Matrix>): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const bv = b(ctx);
        const result = av.append(bv);
        tracing(() => `concat ${av}, ${bv} = ${result}`);
        return result;
    };
}

/**
 * 
 * @param a 
 * @param rows 
 * @param cols 
 */
export function createResizeCode(a: ValueFunction<Matrix>, rows: number, cols: number): ValueFunction<Matrix> {
    return (ctx: Record<string, AnyValue>) => {
        const av = a(ctx);
        const result = av.resize(rows, cols);
        tracing(() => `resive ${av} by ${rows}x${cols} = ${result}`);
        return result;
    };
}