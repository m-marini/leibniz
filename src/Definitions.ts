export type Expression = string;

export type Definitions = Record<string, Expression>

export interface BodyDefinition {
    position: Expression;
    rotation?: Expression;
};

export type BodyDefinitions = BodyDefinition[];

export interface SystemDefinition {
    bodies: BodyDefinitions;
    funcs: Definitions;
    update: Definitions;
    vars: Definitions;
}
