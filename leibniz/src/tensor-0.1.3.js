import { default as _ } from 'lodash';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assert failed');
    }
}

class Quaternion {
    constructor(values) {
        assert(values.length === 4,
            'Assert failed: (values.length === 4), values.length=' + values.length)
        this._values = values;
    }

    get values() { return this._values; }
    get i() { return this._values[0]; }
    get j() { return this._values[1]; }
    get k() { return this._values[2]; }
    get w() { return this._values[3]; }

    /* Returns the negate quaternion */
    negate() {
        return new Quaternion(_.map(this.values, a => -a));
    }

    /* Returns the quaternion by adding another quaternion */
    add(other) {
        const values = _(this.values).zip(other.values).map(ary => _.sum(ary)).value();
        return new Quaternion(values);
    }

    /* Returns the quaternion by adding a real value */
    addValue(other) {
        return new Quaternion([this.i, this.j, this.k, this.w + other]);
    }

    /* Returns the quaternion by subtracting a real value */
    subtractValue(other) {
        return new Quaternion([this.i, this.j, this.k, this.w - other]);
    }

    /* Returns the quaternion by subtracting a real value from this */
    subtractFromValue(other) {
        return new Quaternion([-this.i, -this.j, -this.k, other - this.w]);
    }

    /* Returns the quaternion by subtracting another quaternion */
    subtract(other) {
        const values = _(this.values).zip(other.values).map(ary => ary[0] - ary[1]).value();
        return new Quaternion(values);
    }

    /* Returns the quaternion by multipling a real */
    scale(scale) {
        const values = _.map(this.values, x => x * scale);
        return new Quaternion(values);
    }

    /* Returns the quaternion by multipling another quaternion */
    multiply(other) {
        const ai = this.i;
        const aj = this.j;
        const ak = this.k;
        const a = this.w;
        const bi = other.i;
        const bj = other.j;
        const bk = other.k;
        const b = other.w;

        // ii = jj = kk = -1
        // ij = k
        // jk = i
        // ki = j
        const ci = a * bi + ai * b + aj * bk - ak * bj;
        const cj = a * bj + aj * b + ak * bi - ai * bk;
        const ck = a * bk + ak * b + ai * bj - aj * bi;
        const c = a * b - ai * bi - aj * bj - ak * bk;
        return new Quaternion([ci, cj, ck, c]);
    }

    inverse() {
        const i = this.i;
        const j = this.j;
        const k = this.k;
        const w = this.w;
        const l = i * i + j * j + k * k + w * w;

        return new Quaternion([-i / l, -j / l, -k / l, w / l]);
    }

    divide(other) {
        const ai = this.i;
        const aj = this.j;
        const ak = this.k;
        const aw = this.w;

        const bi = other.i;
        const bj = other.j;
        const bk = other.k;
        const bw = other.w;
        const l = bi * bi + bj * bj + bk * bk + bw * bw;

        const ci = (-aw * bi + ai * bw - aj * bk + ak * bj) / l;
        const cj = (-aw * bj + aj * bw - ak * bi + ai * bk) / l;
        const ck = (-aw * bk + ak * bw - ai * bj + aj * bi) / l;
        const cw = (aw * bw + ai * bi + aj * bj + ak * bk) / l;

        return new Quaternion([ci, cj, ck, cw]);
    }

    module() {
        const ai = this.i;
        const aj = this.j;
        const ak = this.k;
        const aw = this.w;
        return Math.sqrt(ai * ai + aj * aj + ak * ak + aw * aw);
    }

    norma() {
        const ai = this.i;
        const aj = this.j;
        const ak = this.k;
        const aw = this.w;
        const mod = Math.sqrt(ai * ai + aj * aj + ak * ak + aw * aw);

        if (mod > Number.MIN_VALUE) {
            return new Quaternion([ai / mod, aj / mod, ak / mod, aw / mod]);
        } else {
            return new Quaternion([0, 0, 0, 1]);
        }
    }
}

class Matrix {
    constructor(values) {
        this._values = values;
    }
    get values() { return this._values; }
    get rows() { return this.values.length; }
    get cols() { return this.values.length > 0 ? this.values[0].length : 0; }

    map(f) {
        const v = _.map(this.values, (row, i) =>
            _.map(row, (value, j) =>
                f(value, i, j))
        );
        return new Matrix(v);
    }

    trace() {
        const n = Math.min(this.rows, this.cols);
        var trace = 0;
        for (var i = 0; i < n; i++) {
            trace += this.values[i][i];
        }
        return trace;
    }

    /* Returns the negate matrix */
    negate() {
        return this.map(a => -a);
    }

    zipMap(other, f) {
        assert(this.rows === other.rows && this.cols === other.cols,
            'Assert failed: (this.rows === other.rows && this.cols === other.cols), this.rows=' + this.rows
            + ',other.rows=' + other.rows
            + ',this.cols=' + this.cols
            + ',other.cols=' + other.cols);

        const v = _.map(this.values, (row, i) =>
            _.map(row, (value, j) =>
                f(value, other.values[i][j], i, j))
        );
        return new Matrix(v);
    }

    /* Returns the matrix by adding the paramter */
    add(other) {
        return this.zipMap(other, _.add);
    }

    /* Returns the matrix by subtracting the paramter */
    subtract(other) {
        return this.zipMap(other, _.subtract);
    }

    /* Returns a scaled matrix */
    scale(scale) {
        return this.map(a => {
            return a * scale
        });
    }

    /* Returns a scaled matrix */
    divide(scale) {
        return this.map(a => a / scale);
    }

    /* Returns a resized Matrix the filler element is 0 */
    resize(rows, cols) {
        const n = this.rows;
        const m = this.cols;
        const partRows = _(this.values)
            .take(Math.min(n, rows))
            .map(row => {
                const col = _.take(row, Math.min(m, cols));
                for (var i = 0; i < cols - m; i++) {
                    col.push(0);
                }
                return col;
            }).value();
        const appendRows = rows > n ?
            _.map(_.range(rows - n), () =>
                _.map(_.range(cols), () => 0))
            : [];
        const res = _.concat(partRows, appendRows);
        return new Matrix(res);
    }

    transpose() {
        const n = this.rows;
        const m = this.cols;
        const v = new Array(m);
        for (var i = 0; i < m; i++) {
            v[i] = Array(n);
            for (var j = 0; j < n; j++) {
                v[i][j] = this.values[j][i];
            }
        }
        return new Matrix(v);
    }

    multiply(other) {
        assert(this.cols === other.rows,
            'Assert failed: (this.cols === other.rows), this.cols=' + this.cols
            + ',other.rows=' + other.rows);

        const n = this.rows;
        const m = other.cols;
        const l = this.cols;
        const v = new Array(n);
        for (var i = 0; i < n; i++) {
            v[i] = Array(m);
            for (var j = 0; j < m; j++) {
                var acc = 0;
                for (var k = 0; k < l; k++) {
                    acc += this.values[i][k] * other.values[k][j];
                }
                v[i][j] = acc;
            }
        }
        return new Matrix(v);
    }

    append(other) {
        assert(this.rows === other.rows,
            'Assert failed: (this.rows === other.rows), this.rows=' + this.rows
            + ',other.rows=' + other.rows);

        const n = this.rows;
        const m = this.cols;
        const l = other.cols;
        const v = new Array(n);
        for (var i = 0; i < n; i++) {
            v[i] = Array(m + l);
            for (var j = 0; j < m + l; j++) {
                v[i][j] = j < m ? this.values[i][j] : other.values[i][j - m];
            }
        }
        return new Matrix(v);
    }

    insertAt(idx, value) {
        assert(this.cols === 1,
            'Assert failed: (this.cols === 1), this.cols=' + this.cols);
        assert(idx >= 0 && idx <= this.rows,
            'Assert failed: (idx >= 0 && idx <= this.rows), idx=' + idx + ', this.cols=' + this.cols);

        const n = this.rows;
        const v = new Array(n + 1);
        for (var i = 0; i <= n; ++i) {
            v[i] = i < idx
                ? this.values[i]
                : i === idx
                    ? [value] : this.values[i - 1];
        }
        return new Matrix(v);
    }

    qrot() {
        assert(this.rows === 3 && this.cols === 1,
            'Assert failed: ((this.rows === 3 && this.cols === 1), this.rows=' + this.rows
            + ',this.cols=' + this.cols);
        const x = this.values[0][0];
        const y = this.values[1][0];
        const z = this.values[2][0];
        const len = Math.sqrt(x * x + y * y + z * z);
        if (len > Number.MIN_VALUE) {
            const hphi = len / 2.;
            const w = Math.cos(hphi);
            const sa = Math.sin(hphi);
            const i = sa * x / len;
            const j = sa * y / len;
            const k = sa * z / len;
            return new Quaternion([i, j, k, w]);
        } else {
            return new Quaternion([0, 0, 0, 1]);
        }
    }
}

function createField(value) {
    return {
        apply: () => value,
        code: ["value " + value]
    };
}

function createQuaternion(value) {
    return {
        apply: () => new Quaternion(value),
        code: ["quat " + value]
    };
}

function createVector(values) {
    const v = _.map(values, x => [x]);
    return {
        apply: () => new Matrix(v),
        code: ['vector ' + values]
    };
}
function createMatrix(values) {
    return {
        apply: () => new Matrix(values),
        code: ['matrix ' + values]
    };
}
function createRef(id) {
    return {
        apply: (context) => context.resolve(id),
        code: ['ref ' + id]
    };
}
function createQrot(code) {
    return {
        apply: (context) => code.apply(context).qrot(),
        code: _.concat(code.code, ['qrot'])
    };
}
function createField2Quat(code) {
    return {
        apply: (context) => new Quaternion([0, 0, 0, code.apply(context)]),
        code: _.concat(code.code, ['value to quat'])
    };
}
function createNegateField(code) {
    return {
        apply: (context) => -code.apply(context),
        code: _.concat(code.code, ['negate value'])
    };
}
function createNegateQuat(code) {
    return {
        apply: (context) => code.apply(context).negate(),
        code: _.concat(code.code, ['negate quaternion'])
    };
}
function createNegateVector(code) {
    return {
        apply: (context) => code.apply(context).negate(),
        code: _.concat(code.code, ['negate vector'])
    };
}
function createNegateMatrix(code) {
    return {
        apply: (context) => code.apply(context).negate(),
        code: _.concat(code.code, ['negate matrix'])
    };
}
function createProduct(op1, op2) {
    return {
        apply: (context) => op1.apply(context) * op2.apply(context),
        code: _.concat(op1.code, op2.code, ['multiply values'])
    };
}
function createProductQuat(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).multiply(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['multiply quat'])
    };
}
function createQuatModule(code) {
    return {
        apply: (context) => code.apply(context).module(),
        code: _.concat(code.code, ['quat module'])
    };
}
function createScaleQuat(quat, scale) {
    return {
        apply: (context) =>
            quat.apply(context).scale(scale.apply(context)),
        code: _.concat(quat.code, scale.code, ['scale quat'])
    };
}
function createScaleVector(vec, scale) {
    return {
        apply: (context) =>
            vec.apply(context).scale(scale.apply(context)),
        code: _.concat(vec.code, scale.code, ['scale vector'])
    };
}
function createScaleMatrix(mat, scale) {
    return {
        apply: (context) =>
            mat.apply(context).scale(scale.apply(context)),
        code: _.concat(mat.code, scale.code, ['scale matrix'])
    };
}
function createScalarProduct(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).transpose().multiply(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['multiply vector'])
    };
}
function createMatrixVectorProduct(mat, vec) {
    return {
        apply: (context) =>
            mat.apply(context).multiply(vec.apply(context)),
        code: _.concat(mat.code, vec.code, ['multiply matrix by vector'])
    };
}
function createMatrixProduct(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).transpose().multiply(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['multiply matrix'])
    };
}
function createResizeVector(op, rows) {
    return {
        apply: (context) =>
            op.apply(context).resize(rows, 1),
        code: _.concat(op.code, ['resize vector to ' + rows])
    };
}
function createResizeMatrix(op, rows, cols) {
    return {
        apply: (context) =>
            op.apply(context).resize(rows, cols),
        code: _.concat(op.code, ['resize matrix to ' + rows + ',' + cols])
    };
}
function createVectorModule(op) {
    return {
        apply: (context) => {
            const v = op.apply(context);
            return Math.sqrt(v.transpose().multiply(v).values[0][0]);
        },
        code: _.concat(op.code, ['module'])
    };
}
function createDivideField(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context) / op2.apply(context),
        code: _.concat(op1.code, op2.code, ['divide value'])
    };
}
function createDivideVector(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).divide(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['divide vector'])
    };
}
function createDivideMatrix(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).divide(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['divide matrix'])
    };
}
function createSumField(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context) + op2.apply(context),
        code: _.concat(op1.code, op2.code, ['add value'])
    };
}
function createSumQuatField(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).addValue(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['add quat value'])
    };
}
function createSumQuat(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).add(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['add quat'])
    };
}
function createSubFieldQuat(op1, op2) {
    return {
        apply: (context) =>
            op2.apply(context).subtractFromValue(op1.apply(context)),
        code: _.concat(op1.code, op2.code, ['sub value quat'])
    };
}
function createSubQuatField(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).subtractValue(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['sub quat value'])
    };
}
function createSubQuat(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).subtract(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['sub quat'])
    };
}

function createSumVector(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).add(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['add vector'])
    };
}
function createSumMatrix(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).add(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['add matrix'])
    };
}
function createSubField(op1, op2) {
    return {
        apply: (context) => op1.apply(context) - op2.apply(context),
        code: _.concat(op1.code, op2.code, ['subtrac value'])
    };
}
function createSubVector(op1, op2) {
    return {
        apply: (context) => op1.apply(context).subtract(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['subtract vector'])
    };
}
function createSubMatrix(op1, op2) {
    return {
        apply: (context) => op1.apply(context).subtract(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['subtract matrix'])
    };
}
function createPower(op1, op2) {
    return {
        apply: (context) => Math.pow(op1.apply(context), op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['power'])
    };
}
function createCatField(op1, op2) {
    return {
        apply: (context) => {
            const a = op1.apply(context);
            const b = op2.apply(context);
            return new Matrix([[a], [b]]);
        },
        code: _.concat(op1.code, op2.code, ['concat values'])
    };
}
function createInsertFieldAt(vec, op2, idx) {
    return {
        apply: (context) => {
            const a = vec.apply(context);
            const b = op2.apply(context);
            return a.insertAt(idx, b);
        },
        code: _.concat(vec.code, op2.code, ['insert value at ' + idx])
    };
}
function createCatVector(op1, op2) {
    return {
        apply: (context) => {
            const a = op1.apply(context);
            const b = op2.apply(context);
            return a.append(b);
        },
        code: _.concat(op1.code, op2.code, ['concat vectors'])
    };
}
function createInsertVector(op1, op2) {
    return {
        apply: (context) => {
            const a = op1.apply(context);
            const b = op2.apply(context);
            return b.append(a);
        },
        code: _.concat(op1.code, op2.code, ['insert vector'])
    };
}
function createAppendVector(op1, op2) {
    return {
        apply: (context) => {
            const a = op1.apply(context);
            const b = op2.apply(context);
            return a.append(b);
        },
        code: _.concat(op1.code, op2.code, ['append vector'])
    };
}
function createAppendMatrix(op1, op2) {
    return {
        apply: (context) => {
            const a = op1.apply(context);
            const b = op2.apply(context);
            return a.append(b);
        },
        code: _.concat(op1.code, op2.code, ['concat matrix'])
    };
}
function createTransposeMatrix(op1) {
    return {
        apply: (context) => {
            const a = op1.apply(context);
            return a.transpose();
        },
        code: _.concat(op1.code, ['transpose'])
    };
}
function createSin(code) {
    return {
        apply: (context) => Math.sin(code.apply(context)),
        code: _.concat(code.code, ['sin'])
    };
}
function createCos(code) {
    return {
        apply: (context) => Math.cos(code.apply(context)),
        code: _.concat(code.code, ['cos'])
    };
}
function createExp(code) {
    return {
        apply: (context) => Math.exp(code.apply(context)),
        code: _.concat(code.code, ['exp'])
    };
}
function createSqrt(code) {
    return {
        apply: (context) => Math.sqrt(code.apply(context)),
        code: _.concat(code.code, ['sqrt'])
    };
}
function createDivQuatField(op1, op2) {
    return {
        apply: (context) => {
            const a = op1.apply(context);
            const b = op2.apply(context);
            return a.scale(1 / b);
        },
        code: _.concat(op1.code, op2.code, ['div quat value'])
    };
}
function createDivQuat(op1, op2) {
    return {
        apply: (context) => {
            const a = op1.apply(context);
            const b = op2.apply(context);
            return a.divide(b)
        },
        code: _.concat(op1.code, op2.code, ['div quat'])
    };
}
function createTan(code) {
    return {
        apply: (context) => Math.tan(code.apply(context)),
        code: _.concat(code.code, ['tan'])
    };
}
function createAsin(code) {
    return {
        apply: (context) => Math.asin(code.apply(context)),
        code: _.concat(code.code, ['asin'])
    };
}
function createAcos(code) {
    return {
        apply: (context) => Math.acos(code.apply(context)),
        code: _.concat(code.code, ['acos'])
    };
}
function createAtan(code) {
    return {
        apply: (context) => Math.atan(code.apply(context)),
        code: _.concat(code.code, ['atan'])
    };
}
function createLog(code) {
    return {
        apply: (context) => Math.log(code.apply(context)),
        code: _.concat(code.code, ['log'])
    };
}
function createSinh(code) {
    return {
        apply: (context) => Math.sinh(code.apply(context)),
        code: _.concat(code.code, ['sinh'])
    };
}
function createCosh(code) {
    return {
        apply: (context) => Math.cosh(code.apply(context)),
        code: _.concat(code.code, ['cosh'])
    };
}
function createTanh(code) {
    return {
        apply: (context) => Math.tanh(code.apply(context)),
        code: _.concat(code.code, ['tanh'])
    };
}
function createTrace(code) {
    return {
        apply: (context) => code.apply(context).trace(),
        code: _.concat(code.code, ['trace'])
    };
}
function createValueNorma(code) {
    return {
        apply: (context) => 1,
        code: createField(1)
    };
}
function createQuatNorma(code) {
    return {
        apply: (context) => code.apply(context).norma(),
        code: _.concat(code.code, ['quatNorma'])
    };
}
function createVectNorma(code) {
    return {
        apply: (context) => {
            const v = code.apply(context);
            const mod = Math.sqrt(v.transpose().multiply(v).values[0][0]);
            return v.divide(mod);
        },
        code: _.concat(code.code, ['vecNorma'])
    };
}
const OpTreeBuilder = {
    createValueNorma: createValueNorma,
    createQuatNorma: createQuatNorma,
    createVectNorma: createVectNorma,
    createTrace: createTrace,
    createSinh: createSinh,
    createCosh: createCosh,
    createTanh: createTanh,
    createLog: createLog,
    createAtan: createAtan,
    createAcos: createAcos,
    createAsin: createAsin,
    createTan: createTan,
    createField: createField,
    createQuaternion: createQuaternion,
    createVector: createVector,
    createMatrix: createMatrix,
    createRef: createRef,
    createQrot: createQrot,
    createNegateField: createNegateField,
    createNegateQuat: createNegateQuat,
    createNegateVector: createNegateVector,
    createNegateMatrix: createNegateMatrix,
    createProduct: createProduct,
    createScaleVector: createScaleVector,
    createScaleMatrix: createScaleMatrix,
    createScalarProduct: createScalarProduct,
    createMatrixVectorProduct: createMatrixVectorProduct,
    createMatrixProduct: createMatrixProduct,
    createResizeVector: createResizeVector,
    createResizeMatrix: createResizeMatrix,
    createVectorModule: createVectorModule,
    createDivideField: createDivideField,
    createDivideVector: createDivideVector,
    createDivideMatrix: createDivideMatrix,
    createSumField: createSumField,
    createSumVector: createSumVector,
    createSumMatrix: createSumMatrix,
    createSubField: createSubField,
    createSubVector: createSubVector,
    createSubMatrix: createSubMatrix,
    createPower: createPower,
    createCatField: createCatField,
    createInsertFieldAt: createInsertFieldAt,
    createCatVector: createCatVector,
    createInsertVector: createInsertVector,
    createAppendVector: createAppendVector,
    createAppendMatrix: createAppendMatrix,
    createTransposeMatrix: createTransposeMatrix,
    createSin: createSin,
    createCos: createCos,
    createExp: createExp,
    createQuatModule: createQuatModule,
    createSumQuatField: createSumQuatField,
    createSumQuat: createSumQuat,
    createSubFieldQuat: createSubFieldQuat,
    createSubQuatField: createSubQuatField,
    createSubQuat: createSubQuat,
    createField2Quat: createField2Quat,
    createScaleQuat: createScaleQuat,
    createProductQuat: createProductQuat,
    createDivQuatField: createDivQuatField,
    createDivQuat: createDivQuat,
    createSqrt: createSqrt
};

export {
    Matrix,
    Quaternion,
    OpTreeBuilder
};
