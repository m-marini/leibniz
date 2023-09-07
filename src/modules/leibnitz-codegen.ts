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

import { Quaternion } from '@babylonjs/core';
import _ from 'lodash';
import {
    createConstantCode, createNegMatrixCode, createNegQuaternionCode, createNegScalarCode, createPowCode,
    createScalarFunctionCode, createTransposeCode, createQRotCode, createTrCode, createNormalCode, createCylCode,
    createCyl1Code, createSphereCode, createSphere1Code, createScalarInvCode, createQuaternionInvCode, createMatrixInvCode,
    createDetCode, createMinCode, createMaxCode, createMulSSCode, createMulSQCode, createMulSMCode, createMulQQCode,
    createMulMMCode, createNumberRefCode, createDivSSCode, createDivSQCode, createDivQSCode,
    createDivQQCode,
    createDivMSCode,
    createDivMMCode,
    createAddSSCode,
    createAddSQCode,
    createAddQQCode,
    createAddMMCode,
    createSubSSCode,
    createSubSQCode,
    createSubQSCode,
    createSubQQCode,
    createSubMMCode,
    createModQuaternionCode,
    createModVectorCode,
    createConcatSS,
    createInsertCode,
    createAppendScalarCode,
    createResizeCode,
    createAppendCode,
    createScalarMulCode,
    createQuaternionRefCode,
    createMatrixRefCode,
    createModScalarCode,
    createMulQMCode
} from "./leibniz-code";
import { ValueFunction } from "./leibniz-defs";
import { ASTNode, ASTNodeType, baseVectorId, kroneckerId, TreeNode } from "./leibniz-parser";
import { vector, matrix, Matrix } from "./leibniz-tensor";

export enum ValueTypeCode {
    Scalar = 'scalar',
    Vector = 'vector',
    Quaternion = 'quaternion',
    Matrix = 'matrix'
};

export interface ScalarCode {
    type: ValueTypeCode.Scalar;
    code: ValueFunction<number>;
}

export interface QuaternionCode {
    type: ValueTypeCode.Quaternion;
    code: ValueFunction<Quaternion>;
}

export interface VectorCode {
    type: ValueTypeCode.Vector;
    rows: number;
    code: ValueFunction<Matrix>;
}

export interface MatrixCode {
    type: ValueTypeCode.Matrix;
    rows: number;
    cols: number;
    code: ValueFunction<Matrix>;
}

/**
 * 
 */
export type ValueCode = ScalarCode | VectorCode | QuaternionCode | MatrixCode;

export function isScalarCode(x: ValueCode): x is ScalarCode {
    return x.type === ValueTypeCode.Scalar;
}

export function isQuaternionCode(x: ValueCode): x is QuaternionCode {
    return x.type === ValueTypeCode.Quaternion;
}

export function isVectorCode(x: ValueCode): x is VectorCode {
    return x.type === ValueTypeCode.Vector;
}

export function isMatrixCode(x: ValueCode): x is MatrixCode {
    return x.type === ValueTypeCode.Matrix;
}

/**
 * 
 * @param code 
 */
function newScalarCode(code: ValueFunction<number>): ScalarCode {
    return { type: ValueTypeCode.Scalar, code };
}

/**
 * 
 * @param code 
 */
export function newQuaternionCode(code: ValueFunction<Quaternion>): QuaternionCode {
    return { type: ValueTypeCode.Quaternion, code };
}

/**
 * 
 * @param code 
 * @param rows 
 */
export function newVectorCode(code: ValueFunction<Matrix>, rows: number): VectorCode {
    return { type: ValueTypeCode.Vector, rows, code };
}

/**
 * 
 * @param code 
 * @param rows 
 * @param cols 
 */
export function newMatrixCode(code: ValueFunction<Matrix>, rows: number, cols: number): MatrixCode {
    return { type: ValueTypeCode.Matrix, rows, cols, code };
}


/**
 * 
 * @param value 
 */
export function numberCode(value: number): ScalarCode {
    return newScalarCode(createConstantCode(value));
}

/**
 * 
 * @param value 
 */
export function quaternionCode(value: Quaternion): QuaternionCode {
    return newQuaternionCode(createConstantCode(value));
}

/**
 * 
 * @param value 
 */
export function vectorCode(value: Matrix): VectorCode {
    return newVectorCode(createConstantCode(value), value.rows);
}

/**
 * 
 * @param value 
 */
export function matrixCode(value: Matrix): MatrixCode {
    return newMatrixCode(createConstantCode(value), value.rows, value.cols);
}

/**
 * 
 * @param id 
 */
export function refScalarCode(id: string): ScalarCode {
    return newScalarCode(createNumberRefCode(id));
}

/**
 * 
 * @param id 
 */
export function refQuaternionCode(id: string): QuaternionCode {
    return newQuaternionCode(createQuaternionRefCode(id));
}

/**
 * 
 * @param id 
 * @param n 
 */
export function refVectorCode(id: string, n: number): VectorCode {
    return newVectorCode(createMatrixRefCode(id), n);
}

/**
 * 
 * @param id 
 * @param n 
 * @param m
 */
export function refMatrixCode(id: string, n: number, m: number): MatrixCode {
    return newMatrixCode(createMatrixRefCode(id), n, m);
}

export const ConstantCode: Record<string, ValueCode> = {
    PI: numberCode(Math.PI),
    e: numberCode(Math.E),
    i: quaternionCode(new Quaternion(1, 0, 0, 0)),
    j: quaternionCode(new Quaternion(0, 1, 0, 0)),
    k: quaternionCode(new Quaternion(0, 0, 1, 0)),
    ex: vectorCode(vector(1, 0, 0)),
    ey: vectorCode(vector(0, 1, 0)),
    ez: vectorCode(vector(0, 0, 1))
}

export const ReservedReferences = ['dt'];

export const DefaultScalarCode = numberCode(0);
export const DefaultQuaternionCode = quaternionCode(Quaternion.Identity());

/**
 * 
 * @param n 
 */
export function vector0Code(n: number) {
    return vectorCode(vector.apply(undefined, _.range(0, n).map(() => 0)));
}

/**
 * 
 * @param n 
 * @param m 
 */
export function matrix0Code(n: number, m: number) {
    return matrixCode(
        matrix(
            _.range(0, n).map(i =>
                _.range(0, m).map(j => 0)
            )
        )
    );
}

export interface CodeGenContext {
    withTypeCode(arg: ValueCode): CodeGenContext;
    addErrors(errors: string[]): CodeGenContext;
    symbol(id: string): ValueCode | undefined;
    typeCode: ValueCode;
    errors: string[];
}

export class BaseCodeGenContext implements CodeGenContext {
    typeCode: ValueCode;
    symbols: Record<string, ValueCode>;
    errors: string[];

    /**
     * 
     * @param symbols 
     * @param typeCode 
     * @param errors 
     */
    constructor(symbols: Record<string, ValueCode> = {}, typeCode: ValueCode = DefaultScalarCode, errors: string[] = []) {
        this.typeCode = typeCode;
        this.symbols = symbols;
        this.errors = errors;
    }

    /**
     * 
     * @param errors 
     */
    addErrors(errors: string[]): BaseCodeGenContext {
        return new BaseCodeGenContext(this.symbols, this.typeCode, _.concat(this.errors, errors));
    }

    /**
     * 
     * @param arg 
     */
    withTypeCode(arg: ValueCode): BaseCodeGenContext {
        return new BaseCodeGenContext(this.symbols, arg, this.errors);
    }

    /**
     * 
     * @param id 
     */
    symbol(id: string): ValueCode | undefined {
        return this.symbols[id];
    }

    /**
     * 
     * @param id 
     * @param code 
     */
    addSymbol(id: string, code: ValueCode): BaseCodeGenContext {
        return this;
    }
}

/**
 * 
 * @param symbols 
 */
export function createCodeGenContext(symbols: Record<string, ValueCode> = {}) {
    return new BaseCodeGenContext(symbols);
}

const FunctionOpMap: Record<string, (ctx: CodeGenContext) => CodeGenContext> = {
    sin: createUnaryScalarCodeGen(Math.sin),
    cos: createUnaryScalarCodeGen(Math.cos),
    tan: createUnaryScalarCodeGen(Math.tan),
    asin: createUnaryScalarCodeGen(Math.asin),
    acos: createUnaryScalarCodeGen(Math.acos),
    atan: createUnaryScalarCodeGen(Math.atan),
    sinh: createUnaryScalarCodeGen(Math.sinh),
    cosh: createUnaryScalarCodeGen(Math.cosh),
    tanh: createUnaryScalarCodeGen(Math.tanh),
    exp: createUnaryScalarCodeGen(Math.exp),
    log: createUnaryScalarCodeGen(Math.log),
    sqrt: createUnaryScalarCodeGen(Math.sqrt),
    T: transposeCodeGen,
    qrot: qrotCodeGen,
    tr: trCodeGen,
    n: nCodeGen,
    cyl: cylCodeGen,
    cyl1: cyl1CodeGen,
    sphere: sphereCodeGen,
    sphere1: sphere1CodeGen,
    inv: invCodeGen,
    det: detCodeGen,
    min: minCodeGen,
    max: maxCodeGen
};

export const FunctionKeywords = _.keys(FunctionOpMap);

const UnaryOpMap: Record<string, (ctx: CodeGenContext) => CodeGenContext> = _.merge({
    '+': (ctx: CodeGenContext) => ctx,
    '-': negCodeGen,
}, FunctionOpMap);

/**
 * 
 * @param code 
 * @param value 
 */
export function errorByCode(code: string, value: ValueCode): string[] {
    switch (value.type) {
        case ValueTypeCode.Scalar:
            return [`${code}, scalar found`];
        case ValueTypeCode.Quaternion:
            return [`${code}, quaternion found`];
        case ValueTypeCode.Vector:
            return [`${code}, vector${value.rows} found`];
        case ValueTypeCode.Matrix:
            return [`${code}, matrix${value.rows}x${value.cols} found`];
        default:
            return [];
    }
}

function assertRuleNode({ node, children }: TreeNode<ASTNode>, id: string, n?: number) {
    if (node.type !== ASTNodeType.Rule) {
        throw Error(`node ${node.type} !== ${ASTNodeType.Rule}`);
    }
    if (node.rule !== id) {
        throw Error(`node ${node.rule} !== ${id}`);
    }
    if (n !== undefined && children.length !== n) {
        throw Error(`number of children ${children.length} !== ${n}`);
    }
}

/**
 * expression ::= sequence (expr, end-source)
 * @param ctx 
 * @param param1 
 */
export function expressionCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'expression', 2);
    return exprCodeGen(ctx, node.children[0]);
}

/**
 * expr ::= sequence (sum, expr-suffix*)
 * @param ctx 
 * @param param1 
 */
function exprCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'expr', 2);
    const sumCtx = sumCodeGen(ctx, node.children[0]);

    return exprSuffixCodeGen(sumCtx, node.children[1]);
}

/**
 * expr-suffix* ::= repeat (expr-suffix ::= sequence ( , sum))
 * @param ctx 
 * @param node 
 */
function exprSuffixCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'expr-suffix*');

    // Check type of base
    if (node.children.length === 0) {
        return ctx;
    }

    const result = _(node.children).reduce((sum1Ctx, node) => {
        // List of seq ast with ops and factor
        assertRuleNode(node, 'expr-suffix', 2);
        const sum2Ctx = sumCodeGen(sum1Ctx, node.children[1]);
        const opsNode = node.children[0].node;
        if (opsNode.type !== ASTNodeType.Sym) {
            throw new Error(`unexpected node type ${opsNode.type}`);
        }
        return concatCodeGen(sum2Ctx, sum1Ctx.typeCode, sum2Ctx.typeCode);
    }, ctx);
    return result;
}

/**
 * 
 * @param aCtx 
 * @param bCtx 
 */
function concatCodeGen(ctx: CodeGenContext, a: ValueCode, b: ValueCode): CodeGenContext {
    if (isScalarCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newVectorCode(createConcatSS(a.code, b.code), 2));
            case ValueTypeCode.Vector:
                return ctx.withTypeCode(newVectorCode(createInsertCode(a.code, b.code), b.rows + 1));
            case ValueTypeCode.Quaternion:
            case ValueTypeCode.Matrix:
                return ctx.addErrors(errorByCode('scalar or vector expected', b));
        }
    }
    if (isQuaternionCode(a)) {
        return ctx.addErrors(errorByCode('quaternion cannot be concatenated', b));
    }
    if (isVectorCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newVectorCode(createAppendScalarCode(a.code, b.code), a.rows + 1));
            case ValueTypeCode.Quaternion:
                return ctx.addErrors(errorByCode('scalar or vector expected', b));
            case ValueTypeCode.Vector: {
                const ac = a.rows < b.rows ? createResizeCode(a.code, b.rows, 1) : a.code;
                const bc = b.rows < a.rows ? createResizeCode(b.code, a.rows, 1) : b.code;
                return ctx.withTypeCode(
                    newMatrixCode(
                        createAppendCode(ac, bc),
                        Math.max(a.rows, b.rows),
                        2));
            }
            case ValueTypeCode.Matrix: {
                const ac = a.rows < b.rows ? createResizeCode(a.code, b.rows, 1) : a.code;
                const bc = b.rows < a.rows ? createResizeCode(b.code, a.rows, b.cols) : b.code;
                return ctx.withTypeCode(
                    newMatrixCode(
                        createAppendCode(ac, bc),
                        Math.max(a.rows, b.rows),
                        b.cols + 1));
            }
        }
    }
    if (isMatrixCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
            case ValueTypeCode.Quaternion:
                return ctx.addErrors(errorByCode('vector or matrix expected', b));
            case ValueTypeCode.Vector: {
                const ac = a.rows < b.rows ? createResizeCode(a.code, b.rows, a.cols) : a.code;
                const bc = b.rows < a.rows ? createResizeCode(b.code, a.rows, 1) : b.code;
                return ctx.withTypeCode(
                    newMatrixCode(
                        createAppendCode(ac, bc),
                        Math.max(a.rows, b.rows),
                        a.cols + 1));
            }
            case ValueTypeCode.Matrix: {
                const ac = a.rows < b.rows ? createResizeCode(a.code, b.rows, a.cols) : a.code;
                const bc = b.rows < a.rows ? createResizeCode(b.code, a.rows, b.cols) : b.code;
                return ctx.withTypeCode(
                    newMatrixCode(
                        createAppendCode(ac, bc),
                        Math.max(a.rows, b.rows),
                        a.cols + b.cols));
            }
        }
    }
    throw new Error(`invalid branch ${b.type}`);
}

/**
 * sum ::= sequence (factor, sum-suffix*)
 * @param ctx 
 * @param param1 
 */
function sumCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'sum', 2);
    const sumCtx = factorCodeGen(ctx, node.children[0]);

    return sumSuffix(sumCtx, node.children[1]);
}

/**
 * sum-suffix* ::= repeat (sum-suffix ::= sequence ( + | - ) factor))
 * @param ctx 
 * @param node 
 */
function sumSuffix(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'sum-suffix*');

    // Check type of base
    if (node.children.length === 0) {
        return ctx;
    }

    const result = _(node.children).reduce((factor1Ctx, node) => {
        // List of seq ast with ops and factor
        assertRuleNode(node, 'sum-suffix', 2);
        const factor2Ctx = factorCodeGen(factor1Ctx, node.children[1]);
        const opsNode = node.children[0].node;
        if (opsNode.type !== ASTNodeType.Sym) {
            throw new Error(`unexpected node type ${opsNode.type}`);
        }
        switch (opsNode.symbol) {
            case '+':
                return addCodeGen(factor2Ctx, factor1Ctx.typeCode, factor2Ctx.typeCode);
            case '-':
                return subCodeGen(factor2Ctx, factor1Ctx.typeCode, factor2Ctx.typeCode);
            default:
                throw new Error(`unexpected symbol ${opsNode.symbol}`);
        }
    }, ctx);
    return result;
}

/**
 * 
 * @param aCtx 
 * @param bCtx 
 */
function addCodeGen(ctx: CodeGenContext, a: ValueCode, b: ValueCode): CodeGenContext {
    if (isScalarCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newScalarCode(createAddSSCode(a.code, b.code)));
            case ValueTypeCode.Quaternion:
                return ctx.withTypeCode(newQuaternionCode(createAddSQCode(a.code, b.code)));
            case ValueTypeCode.Vector:
            case ValueTypeCode.Matrix:
                return ctx.addErrors(errorByCode('scalar or quaternion expected', b));
        }
    }
    if (isQuaternionCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newQuaternionCode(createAddSQCode(b.code, a.code)));
            case ValueTypeCode.Quaternion:
                return ctx.withTypeCode(newQuaternionCode(createAddQQCode(a.code, b.code)));
            case ValueTypeCode.Vector:
            case ValueTypeCode.Matrix:
                return ctx.addErrors(errorByCode('scalar or quaternion expected', b));
        }
    }
    if (isVectorCode(a)) {
        if (isVectorCode(b)) {
            const ac = a.rows < b.rows ? createResizeCode(a.code, b.rows, 1) : a.code;
            const bc = b.rows < a.rows ? createResizeCode(b.code, a.rows, 1) : b.code;
            return ctx.withTypeCode(newVectorCode(
                createAddMMCode(ac, bc),
                Math.max(a.rows, b.rows)
            ));
        }
        return ctx.addErrors(errorByCode(`vector expected`, b));
    }
    if (isMatrixCode(a)) {
        if (isMatrixCode(b)) {
            const n = Math.max(a.rows, b.rows);
            const m = Math.max(a.cols, b.cols);
            const ac = a.rows < n || a.cols < m ? createResizeCode(a.code, n, m) : a.code;
            const bc = b.rows < n || b.cols < m ? createResizeCode(b.code, n, m) : b.code;
            return ctx.withTypeCode(newMatrixCode(
                createAddMMCode(ac, bc), n, m
            ));
        }
        return ctx.addErrors(errorByCode(`matrix expected`, b));
    }
    throw new Error('Invalid branch');
}

/**
 * 
 * @param aCtx 
 * @param bCtx 
 */
function subCodeGen(ctx: CodeGenContext, a: ValueCode, b: ValueCode): CodeGenContext {
    if (isScalarCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newScalarCode(createSubSSCode(a.code, b.code)));
            case ValueTypeCode.Quaternion:
                return ctx.withTypeCode(newQuaternionCode(createSubSQCode(a.code, b.code)));
            case ValueTypeCode.Vector:
            case ValueTypeCode.Matrix:
                return ctx.addErrors(errorByCode('scalar or quaternion expected', b));
        }
    }
    if (isQuaternionCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newQuaternionCode(createSubQSCode(a.code, b.code)));
            case ValueTypeCode.Quaternion:
                return ctx.withTypeCode(newQuaternionCode(createSubQQCode(a.code, b.code)));
            case ValueTypeCode.Vector:
            case ValueTypeCode.Matrix:
                return ctx.addErrors(errorByCode('scalar or quaternion expected', b));
        }
    }
    if (isVectorCode(a)) {
        if (isVectorCode(b)) {
            const n = Math.max(a.rows, b.rows);
            const ac = a.rows < n ? createResizeCode(a.code, n, 1) : a.code;
            const bc = b.rows < n ? createResizeCode(b.code, n, 1) : b.code;
            return ctx.withTypeCode(newVectorCode(
                createSubMMCode(ac, bc), n
            ));
        }
        return ctx.addErrors(errorByCode(`vector expected`, b));
    }
    if (isMatrixCode(a)) {
        if (isMatrixCode(b)) {
            const n = Math.max(a.rows, b.rows);
            const m = Math.max(a.cols, b.cols);
            const ac = a.rows < n || a.cols < m ? createResizeCode(a.code, n, m) : a.code;
            const bc = b.rows < n || b.cols < m ? createResizeCode(b.code, n, m) : b.code;
            return ctx.withTypeCode(newMatrixCode(
                createSubMMCode(ac, bc), n, m));
        }
        return ctx.addErrors(errorByCode(`matrix expected`, b));
    }
    throw new Error('Invalid branch');
}

/**
 * factor ::= sequence (unary, factor-suffix*)
 * @param ctx 
 * @param param1 
 */
function factorCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'factor', 2);
    const factorCtx = unaryCodeGen(ctx, node.children[0]);

    return factorSuffixCodeGen(factorCtx, node.children[1]);
}

/**
 * factor-suffix* ::= repeat (factor-suffix ::= sequence ( * | / ) unary))
 * @param ctx 
 * @param node 
 */
function factorSuffixCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'factor-suffix*');

    // Check type of base
    if (node.children.length === 0) {
        return ctx;
    }

    const result = _(node.children).reduce((unary1Ctx, node) => {
        // List of seq ast with ops and factor
        assertRuleNode(node, 'factor-suffix', 2);
        const unary2Ctx = unaryCodeGen(unary1Ctx, node.children[1]);
        const opsNode = node.children[0].node;
        if (opsNode.type !== ASTNodeType.Sym) {
            throw new Error(`unexpected node type ${opsNode.type}`);
        }
        switch (opsNode.symbol) {
            case '*':
                return mulCodeGen(unary2Ctx, unary1Ctx.typeCode, unary2Ctx.typeCode);
            case '/':
                return divCodeGen(unary2Ctx, unary1Ctx.typeCode, unary2Ctx.typeCode);
            default:
                throw new Error(`unexpected symbol ${opsNode.symbol}`);
        }
    }, ctx);
    return result;
}

/**
 * 
 * @param aCtx 
 * @param bCtx 
 */
function mulCodeGen(ctx: CodeGenContext, a: ValueCode, b: ValueCode): CodeGenContext {
    if (isScalarCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newScalarCode(createMulSSCode(a.code, b.code)));
            case ValueTypeCode.Quaternion:
                return ctx.withTypeCode(newQuaternionCode(createMulSQCode(a.code, b.code)));
            case ValueTypeCode.Vector:
                return ctx.withTypeCode(newVectorCode(
                    createMulSMCode(a.code, b.code),
                    b.rows
                ));
            case ValueTypeCode.Matrix:
                return ctx.withTypeCode(newMatrixCode(
                    createMulSMCode(a.code, b.code),
                    b.rows,
                    b.cols
                ));
        }
    }
    if (isQuaternionCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newQuaternionCode(createMulSQCode(b.code, a.code)));
            case ValueTypeCode.Quaternion:
                return ctx.withTypeCode(newQuaternionCode(createMulQQCode(a.code, b.code)));
            case ValueTypeCode.Vector:
                if (b.rows === 3) {
                    return ctx.withTypeCode(newVectorCode(createMulQMCode(a.code, b.code), 3));
                } else {
                    return ctx.addErrors(errorByCode('vector3 expected', b));
                }
            case ValueTypeCode.Matrix:
                return ctx.addErrors(errorByCode('scalar or quaternion expected', b));
        }
    }
    if (isVectorCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newVectorCode(
                    createMulSMCode(b.code, a.code),
                    a.rows
                ));
            case ValueTypeCode.Vector: {
                const n = Math.min(a.rows, b.rows);
                const ac = a.rows > n ? createResizeCode(a.code, n, 1) : a.code;
                const bc = b.rows > n ? createResizeCode(b.code, n, 1) : b.code;
                return ctx.withTypeCode(newScalarCode(createScalarMulCode(ac, bc)));
            }

        }
        return ctx.addErrors(errorByCode('scalar expected', b));
    }
    if (isMatrixCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newMatrixCode(
                    createMulSMCode(b.code, a.code),
                    a.rows,
                    a.cols
                ));
            case ValueTypeCode.Vector: {
                const n = Math.min(a.cols, b.rows);
                const ac = a.cols > n ? createResizeCode(a.code, a.rows, n) : a.code;
                const bc = b.rows > n ? createResizeCode(b.code, n, 1) : b.code;
                return ctx.withTypeCode(newVectorCode(
                    createMulMMCode(ac, bc),
                    a.rows
                ));
            }
            case ValueTypeCode.Quaternion:
                return ctx.addErrors(errorByCode('not quaternion expected', b));
            case ValueTypeCode.Matrix: {
                const n = Math.min(a.cols, b.rows);
                const ac = a.cols > n ? createResizeCode(a.code, a.rows, n) : a.code;
                const bc = b.rows > n ? createResizeCode(b.code, n, b.cols) : b.code;
                return ctx.withTypeCode(newMatrixCode(
                    createMulMMCode(ac, bc),
                    a.rows,
                    b.cols
                ));
            }
        }
    }
    throw new Error('Invalid branch');
}

/**
 * 
 * @param aCtx 
 * @param bCtx 
 */
function divCodeGen(ctx: CodeGenContext, a: ValueCode, b: ValueCode): CodeGenContext {
    if (isScalarCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newScalarCode(createDivSSCode(a.code, b.code)));
            case ValueTypeCode.Quaternion:
                return ctx.withTypeCode(newQuaternionCode(createDivSQCode(a.code, b.code)));
            case ValueTypeCode.Vector:
            case ValueTypeCode.Matrix:
                return ctx.addErrors(errorByCode('scalar or quaternion expected', b));
        }
    }
    if (isQuaternionCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newQuaternionCode(createDivQSCode(a.code, b.code)));
            case ValueTypeCode.Quaternion:
                return ctx.withTypeCode(newQuaternionCode(createDivQQCode(a.code, b.code)));
            case ValueTypeCode.Vector:
            case ValueTypeCode.Matrix:
                return ctx.addErrors(errorByCode('scalar or quaternion expected', b));
        }
    }
    if (isVectorCode(a)) {
        if (isScalarCode(b)) {
            return ctx.withTypeCode(newVectorCode(
                createDivMSCode(a.code, b.code),
                a.rows
            ));
        }
        return ctx.addErrors(errorByCode('scalar expected', b));
    }
    if (isMatrixCode(a)) {
        switch (b.type) {
            case ValueTypeCode.Scalar:
                return ctx.withTypeCode(newMatrixCode(
                    createDivMSCode(a.code, b.code),
                    a.rows,
                    a.cols
                ));
            case ValueTypeCode.Vector:
            case ValueTypeCode.Quaternion:
                return ctx.addErrors(errorByCode(`scalar or matrix expected`, b));
            case ValueTypeCode.Matrix:
                const n = Math.min(a.cols, b.rows, b.cols);
                const ac = a.cols > n ? createResizeCode(a.code, a.rows, n) : a.code;
                const bc = b.rows > n || b.cols > n ? createResizeCode(b.code, n, n) : b.code;
                return ctx.withTypeCode(newMatrixCode(
                    createDivMMCode(ac, bc), a.rows, n
                ));
        }
    }
    throw new Error('Invalid branch');
}

/**
 * unary ::= sequence (unary-op*, pow)
 * @param ctx 
 * @param param1 
 */
function unaryCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'unary', 2);
    const unaryCtx = powCodeGen(ctx, node.children[1]);
    return unaryOpCodeGen(unaryCtx, node.children[0]);
}

/**
 * unary-op* ::= repeat ( unary-op:= <list of unary operator as idAST or symbolAST> )
 * @param ctx 
 * @param node 
 */
function unaryOpCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'unary-op*');
    // Check type of base
    if (node.children.length === 0) {
        return ctx;
    }
    const result = _(node.children).reduceRight((locCtx, node) => {
        var tok: string;
        switch (node.node.type) {
            case ASTNodeType.Id:
                tok = node.node.id;
                break;
            case ASTNodeType.Sym:
                tok = node.node.symbol;
                break;
            default:
                throw new Error(`unexpected ${node.node.type}`);
        }
        const op = UnaryOpMap[tok];
        if (!op) {
            throw new Error(`${tok} is not an operator`);
        }
        return op(locCtx);
    }, ctx);
    return result;
}

/**
 * 
 * @param ctx 
 */
function negCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    if (isScalarCode(typeCode)) {
        return ctx.withTypeCode(newScalarCode(createNegScalarCode(typeCode.code)));
    }
    if (isQuaternionCode(typeCode)) {
        return ctx.withTypeCode(newQuaternionCode(createNegQuaternionCode(typeCode.code)));
    }
    if (isVectorCode(typeCode)) {
        return ctx.withTypeCode(newVectorCode(createNegMatrixCode(typeCode.code), typeCode.rows));
    }
    return ctx.withTypeCode(newMatrixCode(createNegMatrixCode(typeCode.code), typeCode.rows, typeCode.cols));
}

/**
 * 
 * @param f 
 */
function createUnaryScalarCodeGen(f: (arg: number) => number): (ctx: CodeGenContext) => CodeGenContext {
    return (ctx: CodeGenContext): CodeGenContext => {
        const { typeCode } = ctx;
        if (!isScalarCode(typeCode)) {
            return ctx.addErrors(errorByCode('scalar expected', typeCode));
        }
        return ctx.withTypeCode(
            newScalarCode(
                createScalarFunctionCode(typeCode.code, f)));
    };
}

/**
 * 
 * @param ctx 
 */
function transposeCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    switch (typeCode.type) {
        case ValueTypeCode.Scalar:
        case ValueTypeCode.Quaternion:
            return ctx;
        case ValueTypeCode.Vector:
            return ctx.withTypeCode(
                newMatrixCode(
                    createTransposeCode(typeCode.code), 1, typeCode.rows
                ));
        case ValueTypeCode.Matrix:
            return ctx.withTypeCode(
                newMatrixCode(
                    createTransposeCode(typeCode.code), typeCode.cols, typeCode.rows
                ));
    }
}

/**
 * 
 * @param ctx 
 */
function qrotCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    if (!isVectorCode(typeCode) || typeCode.rows !== 3) {
        return ctx.addErrors(errorByCode('vector3 expected', typeCode));
    }
    return ctx.withTypeCode(
        newQuaternionCode(
            createQRotCode(typeCode.code)));
}

/**
 * 
 * @param ctx 
 */
function trCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    if (!isMatrixCode(typeCode) || typeCode.rows !== typeCode.cols) {
        return ctx.addErrors(errorByCode('square matrix expected', typeCode));
    }
    return ctx.withTypeCode(
        newScalarCode(createTrCode(typeCode.code)));
}

/**
 * 
 * @param ctx 
 */
function nCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    if (!isVectorCode(typeCode)) {
        return ctx.addErrors(errorByCode('vector expected', typeCode));
    }
    return ctx.withTypeCode(
        newVectorCode(
            createNormalCode(typeCode.code),
            typeCode.rows));
}

/**
 * 
 * @param ctx 
 */
function cylCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    if (!isVectorCode(typeCode) || typeCode.rows !== 3) {
        return ctx.addErrors(errorByCode('vector3 expected', typeCode));
    }
    return ctx.withTypeCode(
        newVectorCode(
            createCylCode(typeCode.code), 3));
}

/**
 * 
 * @param ctx 
 */
function cyl1CodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    if (!isVectorCode(typeCode) || typeCode.rows !== 3) {
        return ctx.addErrors(errorByCode('vector3 expected', typeCode));
    }
    return ctx.withTypeCode(
        newMatrixCode(
            createCyl1Code(typeCode.code), 3, 3));
}

/**
 * 
 * @param ctx 
 */
function sphereCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    if (!isVectorCode(typeCode) || typeCode.rows !== 3) {
        return ctx.addErrors(errorByCode('vector3 expected', typeCode));
    }
    return ctx.withTypeCode(
        newVectorCode(
            createSphereCode(typeCode.code), 3));
}

/**
 * 
 * @param ctx 
 */
function sphere1CodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    if (!isVectorCode(typeCode) || typeCode.rows !== 3) {
        return ctx.addErrors(errorByCode('vector3 expected', typeCode));
    }
    return ctx.withTypeCode(
        newMatrixCode(
            createSphere1Code(typeCode.code), 3, 3));
}

/**
 * 
 * @param ctx 
 */
function invCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    switch (typeCode.type) {
        case ValueTypeCode.Scalar:
            return ctx.withTypeCode(newScalarCode(createScalarInvCode(typeCode.code)));
        case ValueTypeCode.Quaternion:
            return ctx.withTypeCode(newQuaternionCode(createQuaternionInvCode(typeCode.code)));
        case ValueTypeCode.Vector:
            return ctx.addErrors(errorByCode('not vector expected', typeCode));
        case ValueTypeCode.Matrix:
            if (typeCode.cols !== typeCode.rows) {
                return ctx.addErrors(errorByCode('square matrix expected', typeCode));
            }
            return ctx.withTypeCode(
                newMatrixCode(
                    createMatrixInvCode(typeCode.code),
                    typeCode.rows,
                    typeCode.cols));
        default:
            throw new Error('Inconsistency branch')
    }
}

/**
 * 
 * @param ctx 
 */
function detCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    switch (typeCode.type) {
        case ValueTypeCode.Scalar:
        case ValueTypeCode.Quaternion:
            return ctx;
        case ValueTypeCode.Vector:
            return ctx.addErrors(errorByCode('square matrix expected', typeCode));
        case ValueTypeCode.Matrix:
            if (typeCode.cols !== typeCode.rows) {
                return ctx.addErrors(errorByCode('square matrix expected', typeCode));
            }
            return ctx.withTypeCode(newScalarCode(createDetCode(typeCode.code)));
        default:
            throw new Error('Inconsistency branch')
    }
}

/**
 * 
 * @param ctx 
 */
function maxCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    switch (typeCode.type) {
        case ValueTypeCode.Scalar:
        case ValueTypeCode.Quaternion:
            return ctx.addErrors(errorByCode('vector or matrix expected', typeCode));
        case ValueTypeCode.Vector:
        case ValueTypeCode.Matrix:
            return ctx.withTypeCode(newScalarCode(createMaxCode(typeCode.code)));
        default:
            throw new Error('Inconsistency branch')
    }
}

/**
 * 
 * @param ctx 
 */
function minCodeGen(ctx: CodeGenContext): CodeGenContext {
    const { typeCode } = ctx;
    switch (typeCode.type) {
        case ValueTypeCode.Scalar:
        case ValueTypeCode.Quaternion:
            return ctx.addErrors(errorByCode('vector or matrix expected', typeCode));
        case ValueTypeCode.Vector:
        case ValueTypeCode.Matrix:
            return ctx.withTypeCode(newScalarCode(createMinCode(typeCode.code)));
        default:
            throw new Error('Inconsistency branch')
    }
}

/**
 * pow ::= sequence (terminal, pow-suffix*)
 * @param ctx 
 * @param ast 
 */
function powCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'pow', 2);
    const baseCtx = terminalCodeGen(ctx, node.children[0]);
    return powSuffix(baseCtx, node.children[1]);
}

/**
 * pow-suffix* ::= repeat ( pow-suffix ::= sequence( ^, terminal))
 * @param ctx 
 * @param suffix 
 */
function powSuffix(ctx: CodeGenContext, node: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(node, 'pow-suffix*');

    // Check type of base
    if (node.children.length === 0) {
        return ctx;
    }
    const baseCode = ctx.typeCode;
    if (!isScalarCode(baseCode)) {
        return ctx.addErrors(errorByCode(`scalar expected`, baseCode));
    }
    const result = _(node.children).reduce((baseCtx, node) => {
        // List of seq ast with exponents
        assertRuleNode(node, 'pow-suffix', 2);
        const baseCode = baseCtx.typeCode;
        if (!isScalarCode(baseCode)) {
            throw new Error('invalid branch');
        }

        const expCtx = terminalCodeGen(baseCtx, node.children[1]);
        const expCode = expCtx.typeCode;
        if (!isScalarCode(expCode)) {
            return expCtx.addErrors(errorByCode(`scalar expected`, expCode));
        }
        return expCtx.withTypeCode(
            newScalarCode(
                createPowCode(baseCode.code, expCode.code)));
    }, ctx);
    return result;
}

/**
 * terminal := number, id, priority
 * @param ctx 
 * @param ast 
 */
function terminalCodeGen(ctx: CodeGenContext, ast: TreeNode<ASTNode>): CodeGenContext {
    const { node } = ast;
    switch (node.type) {
        case ASTNodeType.Number:
            return ctx.withTypeCode(numberCode(parseFloat(node.value)));
        case ASTNodeType.Id:
            return idCodeGen(ctx, node.id);
        case ASTNodeType.Rule:
            switch (node.rule) {
                case 'bracket':
                    return braketCodeGen(ctx, ast);
                case 'module':
                    return moduleCodeGen(ctx, ast);
            }
    }
    throw new Error(`invalid tree at ${node.type}`);
}

/**
 * barcket ::= sequence( ( expr ) )
 * @param ctx 
 * @param id 
 */
function braketCodeGen(ctx: CodeGenContext, ast: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(ast, 'bracket', 3);
    return exprCodeGen(ctx, ast.children[1]);
}

/**
 * module ::= sequence (| expr |)
 * @param ctx 
 * @param id 
 */
function moduleCodeGen(ctx: CodeGenContext, ast: TreeNode<ASTNode>): CodeGenContext {
    assertRuleNode(ast, 'module', 3);
    const modCtx = exprCodeGen(ctx, ast.children[1]);
    const { typeCode } = modCtx;
    switch (typeCode.type) {
        case ValueTypeCode.Scalar:
            return modCtx.withTypeCode(newScalarCode(createModScalarCode(typeCode.code)));
        case ValueTypeCode.Quaternion:
            return modCtx.withTypeCode(newScalarCode(createModQuaternionCode(typeCode.code)));
        case ValueTypeCode.Vector:
            return modCtx.withTypeCode(newScalarCode(createModVectorCode(typeCode.code)));
        case ValueTypeCode.Matrix:
            return modCtx.addErrors(errorByCode('not matrix expected', typeCode));
    }
}

/**
 * 
 * @param ctx 
 * @param id 
 */
function idCodeGen(ctx: CodeGenContext, id: string): CodeGenContext {
    // Test for predefined references
    if (ReservedReferences.indexOf(id) >= 0) {
        return ctx.withTypeCode(refScalarCode(id));
    }

    // Test for constant keywords
    const k = ConstantCode[id];
    if (k) {
        return ctx.withTypeCode(k);
    }
    // Test for base vector keywords
    const vn = baseVectorId(id);
    if (vn) {
        const n = parseInt(vn);
        const values = _.range(0, n + 1).map(i => i === n ? 1 : 0) as number[];
        return ctx.withTypeCode(vectorCode(vector.apply(undefined, values)));
    }
    // Test for kronecker keywords
    const kn = kroneckerId(id);
    if (kn) {
        const n = parseInt(kn);
        const values = _.range(0, n).map(i =>
            _.range(0, n).map(j =>
                i === j ? 1 : 0) as number[]);
        return ctx.withTypeCode(matrixCode(matrix(values)));
    }
    // Resolve id
    const symbol = ctx.symbol(id);
    return ctx.withTypeCode(symbol ?? DefaultScalarCode);
}
