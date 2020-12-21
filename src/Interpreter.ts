import { Expression } from "./Definitions";

/**
 * 
 */
export interface ExpressionNode {
    exp: Expression;
    errors: string[];
};

/**
 * 
 */
export type ExpressionNodes = Record<string, ExpressionNode>;

/**
 * 
 */
export interface BodyNode {
    position: ExpressionNode;
    rotation?: ExpressionNode;
};

/**
 * 
 */
export type BodyNodes = BodyNode[];

/**
 * 
 */
export interface SystemNode {
    bodies: BodyNodes;
    funcs: ExpressionNodes;
    update: ExpressionNodes;
    vars: ExpressionNodes;
    next: (dt: number) => SystemNode;
    dumpWithDt: (dt: number) => any;
};

export interface System {
    system: SystemNode;
}

export interface InterpreterResult {
    parserState: any;
    errors: {
        funcs: {
            [x: string]: string[];
        };
        vars: {
            [x: string]: string[];
        };
        update: {
            [x: string]: string[];
        };
        bodies: {
            position: string[];
            rotation?: string[];
        }[];
    };
    system: System | undefined;
}