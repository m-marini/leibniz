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

export const CurrentSysDefVersion = "0.1";

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
