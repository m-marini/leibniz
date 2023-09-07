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
import { Quaternion } from "@babylonjs/core";
import { AnyValue, Matrix } from "./leibniz-tensor";

export interface BodyStructurePR<P, R> {
    position: P;
    rotation?: R;
}

export type BodyStructure<T> = BodyStructurePR<T, T>;

export interface SystemStructure<T> {
    bodies: BodyStructure<T>[];
    initialStatus: Record<string, T>;
    transition: Record<string, T>;
    funcs: Record<string, T>;
}

export const CurrentSysDefVersion = "0.2";

export interface SystemDefinition extends SystemStructure<string> {
    version: string;
}

export type InternalStatus = Record<string, AnyValue>;

export type ValueFunction<T extends AnyValue> = (arg: InternalStatus) => T;

export type AnyValueFunction = ValueFunction<AnyValue>;

/**
 * The body status with a position and an optional rotation
 */
export type BodyStatus = BodyStructurePR<Matrix, Quaternion>;

export interface SystemRules {
    bodies: (ctx: InternalStatus) => BodyStatus[];
    initialStatus: () => InternalStatus;
    next: (ctx: InternalStatus, dt: number) => InternalStatus;
}

export type Errors = string[];

export type SystemErrors = SystemStructure<Errors>;

export interface CompilerResult {
    rules: SystemRules;
    errors: SystemErrors;
};
