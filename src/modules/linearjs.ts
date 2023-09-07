export class Tensor {
    static zeros(shape: number[]) {
        const stride = new Array<number>(shape.length);
        return new Tensor([0], shape, stride);
    }
    static ones(shape: number[]) {
        const stride = new Array<number>(shape.length);
        return new Tensor([1], shape, stride);
    }

    static vector(values: number[]) {
        return new Tensor(values, [values.length], [1]);
    }

    static matrix(values: number[], rows: number, cols: number) {
        if (values.length !== rows * cols) {
            throw `Wrong size (${values.length}) expected (${rows * cols})`;
        }
        return new Tensor(values, [rows, cols], [cols, 1]);
    }

    static matrixFromArray(values: number[][]) {
        const buffer = values.flat();
        const rows = values.length;
        const cols = values[0].length;
        return new Tensor(buffer, [rows, cols], [cols, 1]);
    }

    static tensor(values: number[], shape: number[]) {
        const n = shape.reduce((a, b) => a * b);
        if (values.length !== n) {
            throw `Wrong number of values (${values.length}) expected (${n})`;
        }
        const stride = new Array<number>(shape.length);
        stride[stride.length - 1] = 1;
        for (let i = shape.length - 1; i > 0; i--) {
            stride[i - 1] = stride[i] * shape[i];
        }
        return new Tensor(values, shape, stride);
    }

    private _buffer: number[];
    private _shape: number[];
    private _stride: number[];

    /**
     * Creates a tensor
     * @param data the cell values
     * @param size the size of tensor
     * @param stride the stride along dimensions
     */
    constructor(data: number[], size: number[], stride: number[]) {
        this._buffer = data;
        this._shape = size;
        this._stride = stride;
    }

    /**
     * Returns the data buffer
     */
    get buffer() { return this._buffer; }

    /**
     * Returns the shape of tensor
     */
    get shape() { return this._shape; }

    /**
     * Returns the stride by dimension
     */
    get stride() { return this._stride; }

    /**
     * Returns the value of a cell
     * @param indices the element indices
     */
    get(indices: number[]) {
        this._buffer[this.getIndex(indices)];
    }

    /**
     * Returns the index in the buffer of an element
     * @param indices the element indices
     */
    getIndex(indices: number[]) {
        if (indices.length != this._shape.length) {
            throw `Wrong number of indices (${indices.length}) expected (${this._shape.length})`;
        }
        let idx = 0;
        // iterate along the dimensions
        for (let i = 0; i < this._stride.length; i++) {
            idx += indices[i] * this._stride[i];
        }
        return idx;
    }

    toString() {
        const n = this._shape.length;
        const indices = new Array<number>();
        for (let d = 0; d < this._shape.length; d++) {
        }
    }
}