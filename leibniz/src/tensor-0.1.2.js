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

    /* Returns the quaternion by subtracting another quaternion */
    subtract(other) {
        const values = _(this.values).zip(other.values).map(ary => ary[0] - ary[1]).value();
        return new Quaternion(values);
    }

    exp() {
        const ew = new Quaternion([0, 0, 0, Math.exp(this.w)]);
        const ei = new Quaternion([Math.sin(this.i), 0, 0, Math.cos(this.i)]);
        const ej = new Quaternion([0, Math.sin(this.j), 0, Math.cos(this.j)]);
        const ek = new Quaternion([0, 0, Math.sin(this.k), Math.cos(this.k)]);
        return ew.multiply(ei.multiply(ej.multiply(ek)));
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

    sin() {
        return new Quaternion([0, 0, 0, Math.sin(this.w)]);
    }

    cos() {
        return new Quaternion([0, 0, 0, Math.cos(this.w)]);
    }
}

const Zero = new Quaternion([0, 0, 0, 0]);

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

    /* Returns the negate matrix */
    negate() {
        return this.map(a =>
            a.negate());
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
        return this.zipMap(other, (a, b) =>
            a.add(b));
    }

    /* Returns the matrix by subtracting the paramter */
    subtract(other) {
        return this.zipMap(other, (a, b) =>
            a.subtract(b));
    }

    /* Returns a scaled matrix */
    scale(scale) {
        return this.map(a =>
            a.multiply(scale)
        );
    }

    /* Returns a scaled matrix */
    divide(scale) {
        return this.map(a =>
            a.divide(scale)
        );
    }

    /* Returns a resized Matrix the filler element is 0 */
    resize(rows, cols) {
        const n = this.rows;
        const m = this.cols;
        const partRows = _(this.values)
            .take(Math.min(n, rows))
            .map(row => {
                const col = _.take(row, Math.min(m, cols))
                return (cols <= m) ? col
                    : _.concat(col, _.map(_.range(cols - m), () => Zero));
            }).value();
        const appendRows = rows > n
            ? _.map(_.range(rows - n), () =>
                _.map(_.range(cols), () => Zero))
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
                var acc = Zero;
                for (var k = 0; k < l; k++) {
                    acc = acc.add(this.values[i][k].multiply(other.values[k][j]));
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
        const x = this.values[0][0].w;
        const y = this.values[1][0].w;
        const z = this.values[2][0].w;
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
        apply: () => new Quaternion(value),
        code: ["value " + value]
    };
}
function createVector(values) {
    const v = _.map(values, x => [new Quaternion(x)]);
    return {
        apply: () => new Matrix(v),
        code: ['vector ' + values]
    };
}
function createMatrix(values) {
    const mtx = _.map(values, row =>
        _.map(row, x =>
            new Quaternion(x)
        ));
    return {
        apply: () => new Matrix(mtx),
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
function createNegateField(code) {
    return {
        apply: (context) => code.apply(context).negate(),
        code: _.concat(code.code, ['negate value'])
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
        apply: (context) =>
            op1.apply(context).multiply(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['multiply values'])
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
            return v.transpose().multiply(v);
        },
        code: _.concat(op.code, ['module'])
    };
}
function createDivideField(op1, op2) {
    return {
        apply: (context) =>
            op1.apply(context).divide(op2.apply(context)),
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
            op1.apply(context).add(op2.apply(context)),
        code: _.concat(op1.code, op2.code, ['add value'])
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
        apply: (context) => op1.apply(context).subtract(op2.apply(context)),
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
        apply: (context) => op1.apply(context).power(op2.apply(context)),
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
        apply: (context) =>
            code.apply(context).sin(),
        code: _.concat(code.code, ['sin'])
    };
}
function createCos(code) {
    return {
        apply: (context) =>
            code.apply(context).cos(),
        code: _.concat(code.code, ['cos'])
    };
}
function createExp(code) {
    return {
        apply: (context) =>
            code.apply(context).exp(),
        code: _.concat(code.code, ['cos'])
    };
}

const OpTreeBuilder = {
    createField: createField,
    createVector: createVector,
    createMatrix: createMatrix,
    createRef: createRef,
    createQrot: createQrot,
    createNegateField: createNegateField,
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
    createCatVectorcreateCatVector: createCatVector,
    createInsertVector: createInsertVector,
    createAppendVector: createAppendVector,
    createAppendMatrix: createAppendMatrix,
    createTransposeMatrix: createTransposeMatrix,
    createSin: createSin,
    createCos: createCos,
    createExp: createExp
};

export {
    Matrix,
    Quaternion,
    OpTreeBuilder
};
