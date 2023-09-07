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

import { Quaternion, Vector3 } from '@babylonjs/core';
import _ from 'lodash';

/**
 * 
 * @param condition 
 * @param message 
 */
export function assert(condition: boolean, message?: () => string) {
    if (!condition) {
        throw new Error(message ? message() : 'Assert failed');
    }
}

/**
 * 
 */
export class Matrix {
    private _values: number[][];

    /**
     * 
     * @param values 
     */
    constructor(values: number[][]) {
        this._values = values;
    }

    get isMatrix() { return true; }
    get rows() { return this._values.length; }
    get cols() { return this.rows > 0 ? this._values[0].length : 0; }

    private get flatten() {
        return _.flatMap(_.range(0, this.rows), i =>
            _.range(0, this.cols).map(j => this.get(i, j))
        );
    }

    get(i: number, j: number = 0) { return this._values[i][j]; }

    /**
     * 
     */
    toString() {
        const result = _.range(0, this.rows).map(i =>
            _.range(0, this.cols).map(j =>
                this.get(i, j)).join(',')
        ).map(row => `[${row}]`).join(',');
        return `[${result}]`;
    }

    /**
     * 
     * @param f 
     */
    map(f: (v: number, i: number, j: number) => number) {
        const result = _.range(0, this.rows).map(i =>
            _.range(0, this.cols).map(j =>
                f(this.get(i, j), i, j)));
        return new Matrix(result);
    }

    /**
     * 
     */
    trace() {
        const n = Math.min(this.rows, this.cols);
        var trace = 0;
        for (var i = 0; i < n; i++) {
            trace += this.get(i, i);
        }
        return trace;
    }

    /**
     * Returns the negate matrix
     */
    negate() {
        return this.map(a => -a);
    }

    /**
     * 
     * @param other 
     * @param f 
     */
    zipMap(other: Matrix, f: (a: number, b: number, i: number, j: number) => number) {
        assert(this.rows === other.rows && this.cols === other.cols,
            () => `Assert failed: (this.rows === other.rows && this.cols === other.cols), this=${this.rows}x${this.cols}, other=${other.rows}x${other.cols}`);

        const result = _.range(0, this.rows).map(i =>
            _.range(0, this.cols).map(j =>
                f(this.get(i, j), other.get(i, j), i, j)));
        return new Matrix(result);
    }

    /**
     * Returns the matrix by adding the paramter
     * @param other 
     */
    add(other: Matrix) {
        return this.zipMap(other, _.add);
    }

    /**
     * Returns the matrix by subtracting the paramter
     * @param other 
     */
    subtract(other: Matrix) {
        return this.zipMap(other, _.subtract);
    }

    /**
     * Returns a scaled matrix
     * @param scale 
     */
    scale(scale: number) {
        return this.map(a => {
            return a * scale
        });
    }

    /**
     * Returns a scaled matrix
     * @param scale 
     */
    divide(scale: number) {
        return this.map(a => a / scale);
    }

    /**
     * Returns a resized Matrix the filler element is 0
     * 
     * @param rows 
     * @param cols 
     */
    resize(rows: number, cols: number) {
        const n = this.rows;
        const m = this.cols;
        const partRows = _(this._values)
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

    /**
     * 
     */
    transpose() {
        const n = this.rows;
        const m = this.cols;
        const v = _.range(0, m).map(i =>
            _.range(0, n).map(j =>
                this.get(j, i)))
        return new Matrix(v);
    }

    /**
     * 
     * @param other 
     */
    multiply(other: Matrix) {
        assert(this.cols === other.rows,
            () => 'Assert failed: (this.cols === other.rows), this.cols=' + this.cols
                + ',other.rows=' + other.rows);

        const n = this.rows;
        const m = other.cols;
        const l = this.cols;
        const v = _.range(0, n).map(i =>
            _.range(0, m).map(j =>
                _.sum(_.range(0, l).map(k =>
                    this.get(i, k) * other.get(k, j)))));
        return new Matrix(v);
    }

    /**
     * 
     * @param other 
     */
    dot(other: Matrix) {
        assert(this.cols === 1,
            () => `Assert failed: (this.cols === 1), this.cols=${this.cols}`);
        assert(other.cols === 1,
            () => `Assert failed: (other.cols === 1), other.cols=${other.cols}`);
        assert(this.rows === other.rows,
            () => `Assert failed: (this.rows === other.rows), this.rows=${this.rows}, other.rows=${other.rows}`);

        const n = this.rows;
        const v = _.sum(_.range(0, n).map(k =>
            this.get(k, 0) * other.get(k, 0)));
        return v;
    }

    /**
     * 
     */
    module() {
        return Math.sqrt(this.dot(this));
    }

    /**
     * 
     */
    norma() {
        const m = this.module();
        return m > 1E-38 ? this.divide(m) : this;
    }

    /**
     * 
     * @param other 
     */
    append(other: Matrix) {
        assert(this.rows === other.rows,
            () => 'Assert failed: (this.rows === other.rows), this.rows=' + this.rows
                + ',other.rows=' + other.rows);

        const n = this.rows;
        const m = this.cols;
        const l = other.cols;
        const v = _.range(0, n).map(i =>
            _.range(0, m + l).map(j =>
                j < m ? this.get(i, j) : other.get(i, j - m)));
        return new Matrix(v);
    }

    /**
     * 
     * @param idx 
     * @param value 
     */
    insertAt(idx: number, value: number) {
        assert(this.cols === 1,
            () => 'Assert failed: (this.cols === 1), this.cols=' + this.cols);
        assert(idx >= 0 && idx <= this.rows,
            () => 'Assert failed: (idx >= 0 && idx <= this.rows), idx=' + idx + ', this.cols=' + this.cols);

        const n = this.rows;
        const v = _.range(0, n + 1).map(i =>
            i < idx ?
                [this.get(i)] :
                i === idx ?
                    [value] :
                    [this.get(i - 1)]);
        return new Matrix(v);
    }

    /**
     * 
     */
    qrot() {
        assert(this.rows === 3 && this.cols === 1,
            () => 'Assert failed: (this.rows === 3 && this.cols === 1), this.rows=' + this.rows
                + ', this.cols=' + this.cols);
        const x = this.get(0);
        const y = this.get(1);
        const z = this.get(2);
        const len = this.module()
        return Quaternion.RotationAxis(new Vector3(x, y, z), len);
        // if (len > Number.MIN_VALUE) {
        //     const hphi = len / 2.;
        //     const w = Math.cos(hphi);
        //     const sa = Math.sin(hphi);
        //     const i = sa * x / len;
        //     const j = sa * y / len;
        //     const k = sa * z / len;
        //     return new Quaternion(i, j, k, w);
        // } else {
        //     return new Quaternion(0, 0, 0, 1);
        // }
    }

    /**
     * 
     */
    cyl() {
        assert(this.rows === 3 && this.cols === 1,
            () => 'Assert failed: (this.rows === 3 && this.cols === 1), this.rows=' + this.rows
                + ', this.cols=' + this.cols);
        const r = this.get(0);
        const phi = this.get(1);
        const z = this.get(2);
        return new Matrix([
            [r * Math.sin(phi)],
            [r * Math.cos(phi)],
            [z]
        ]);
    }

    /**
     * 
     */
    sphere() {
        assert(this.rows === 3 && this.cols === 1,
            () => 'Assert failed: ((this.rows === 3 && this.cols === 1), this.rows=' + this.rows
                + ',this.cols=' + this.cols);
        const r = this.get(0);
        const theta = this.get(1);
        const phi = this.get(2);
        const rr = r * Math.sin(theta);
        return new Matrix([
            [rr * Math.cos(phi)],
            [rr * Math.sin(phi)],
            [r * Math.cos(theta)]
        ]);
    }

    /**
     * 
     */
    cyl1() {
        assert(this.rows === 3 && this.cols === 1,
            () => 'Assert failed: (this.rows === 3 && this.cols === 1), this.rows=' + this.rows
                + ', this.cols=' + this.cols);
        const r = this.get(0);
        const phi = this.get(1);
        const sin = Math.sin(phi);
        const cos = Math.cos(phi);
        return new Matrix([
            [cos, -r * sin, 0],
            [sin, r * cos, 0],
            [0, 0, 1]
        ]);
    }

    /**
     * 
     */
    sphere1() {
        assert(this.rows === 3 && this.cols === 1,
            () => 'Assert failed: (this.rows === 3 && this.cols === 1), this.rows=' + this.rows
                + ', this.cols=' + this.cols);

        const r = this.get(0, 0);
        const theta = this.get(1);
        const phi = this.get(2);
        const sint = Math.sin(theta);
        const cost = Math.cos(theta);
        const sinp = Math.sin(phi);
        const cosp = Math.cos(phi);
        const sincos = sint * cosp;
        const sinsin = sint * sinp;
        const coscos = cost * cosp;
        return new Matrix([
            [sincos, r * coscos, -r * sinsin],
            [sinsin, r * cost * cosp, r * sincos],
            [cost, -r * sint, 0]
        ]);
    }

    /**
     * 
     */
    inverse() {
        const { enchelon } = this.gaussJordan();
        const n = this.rows;
        const inv = _.map(enchelon, row => _.drop(row, n));
        return new Matrix(inv);
    }

    /**
     * 
     */
    det() {
        const { det } = this.gaussJordan();
        return det;
    }

    /**
     * 
     */
    gaussJordan() {
        assert(this.rows === this.cols,
            () => 'Assert failed: (this.rows === this.cols), this.rows=' + this.rows
                + ', this.cols=' + this.cols);
        const n = this.rows;
        const mtx = Array<number[]>(n);
        for (var i = 0; i < n; i++) {
            mtx[i] = Array(2 * n);
        }
        for (i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                mtx[i][j] = this.get(i, j);
                mtx[i][j + n] = i === j ? 1 : 0;
            }
        }
        var det = 1;
        var h = 0; // pivot row
        var k = 0; // pivot col
        while (h < n && k < n) {
            // Find pivot row
            var imax = h;
            var max = Math.abs(mtx[h][k]);
            for (i = h + 1; i < n; i++) {
                const mx = Math.abs(mtx[i][k]);
                if (mx > max) {
                    imax = i;
                    max = mx;
                }
            }
            if (max === 0) {
                /* No pivot in this column, pass to next column */
                k++;
            } else {
                //Swap row imax, h
                const tr = mtx[imax];
                mtx[imax] = mtx[h];
                mtx[h] = tr;
                det = -det;

                for (i = h + 1; i < n; i++) {
                    const f = mtx[i][k] / mtx[h][k];
                    mtx[i][k] = 0;
                    /* Do for all remaining elements in current row: */
                    for (j = k + 1; j < 2 * n; j++) {
                        mtx[i][j] -= mtx[h][j] * f;
                    }
                }
                h++;
                k++;
            }
        }
        // Inverse matrix does not exist
        assert(h === k, () => 'Inverse matrix does not exist');
        // Reverse
        for (h = n - 1; h >= 0; h--) {
            for (i = 0; i < h; i++) {
                // mtx[i][j] = mtx[i][j] + mtx[h][j] * f;
                // mtx[i][h] + mtx[h][h] * f = 0
                //f = -mtx[i][h]/mtx[h][h];
                const f = mtx[i][h] / mtx[h][h];
                mtx[i][h] = 0;
                for (j = h + 1; j < 2 * n; j++) {
                    // mtx[i][h] = 0 = mtx[i][h] - mtx[h][j] * f;
                    mtx[i][j] -= mtx[h][j] * f;
                }
            }
            for (j = h + 1; j < 2 * n; j++) {
                mtx[h][j] /= mtx[h][h];
            }
            det *= mtx[h][h];
            mtx[h][h] = 1;
        }
        return {
            enchelon: mtx,
            det: det
        };
    }

    /**
     * 
     */
    min() { return _.min(this.flatten) ?? Number.NEGATIVE_INFINITY; }

    /**
     * 
     */
    max() { return _.max(this.flatten) ?? Number.POSITIVE_INFINITY; }
}

export type AnyValue = number | Quaternion | Matrix;

/**
 * 
 * @param value 
 */
export function isNumber(value: AnyValue): value is number {
    return typeof value === 'number';
}

/**
 * 
 * @param value 
 */
export function isQuaternion(value: AnyValue): value is Quaternion {
    return (value as Quaternion).w !== undefined;
}

/**
 * 
 * @param value 
 */
export function isMatrix(value: AnyValue): value is Matrix {
    return !!(value as Matrix).isMatrix;
}

/**
 * 
 * @param values 
 */
export function vector(...values: number[]): Matrix {
    return new Matrix([values]).transpose();
}

/**
 * 
 * @param values 
 */
export function matrix(values: number[][]): Matrix {
    return new Matrix(values);
}

/**
 * Returns the (yaw, pitch, roll) vector from quaternion
 * @param q the quaternion
 */
export function ypr(q: Quaternion): Vector3 {
    const yaw = -Math.atan2(
        2 * (q._x * q._y + q._w * q._z),
        q._w * q._w + q._x * q._x - q._y * q._y - q._y - q._z * q._z);
    const pitch = -Math.asin(-2 * (q._x * q._z - q._w * q._y));
    const roll = Math.atan2(2 * (q._y * q._z + q._w * q._x),
        q._w * q._w - q._x * q._x - q._y * q._y + q._z * q._z);

    return new Vector3(yaw, pitch, roll);
}
