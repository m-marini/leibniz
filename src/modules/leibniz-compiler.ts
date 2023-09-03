
import { ASTNode, ASTNodeType, baseVectorId, deepFirstFlatMap, kroneckerId, parse, TreeNode } from "./leibniz-parser";
import _ from 'lodash';
import {
    BodyStructure, Errors, SystemDefinition, SystemErrors, CompilerResult,
    SystemStructure, BodyStatus, BodyStructurePR, CurrentSysDefVersion
} from "./leibniz-defs";
import { AnyValue } from "./leibniz-tensor";
import {
    ValueCode, ConstantCode,
    createCodeGenContext, expressionCodeGen,
    DefaultScalarCode,
    ValueTypeCode,
    isVectorCode,
    isQuaternionCode,
    errorByCode,
    CodeGenContext,
    isScalarCode,
    isMatrixCode,
    numberCode,
    vector0Code,
    DefaultQuaternionCode,
    refScalarCode,
    refVectorCode,
    refQuaternionCode,
    refMatrixCode,
    matrix0Code,
    FunctionKeywords
} from "./leibnitz-codegen";
import { Validator } from "jsonschema";

const VersionPattern = /^(\d*)\.(\d*)$/;

const SystemDefinitionSchema = {
    type: 'object',
    properties: {
        version: { type: 'string', pattern: '^\\d*\\.\\d*$' },
        bodies: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    position: { type: 'string' },
                    rotation: { type: 'string' }
                },
                required: ['position']
            }
        },
        funcs: {
            type: 'object',
            additionalProperties: { type: 'string' }
        },
        initialStatus: {
            type: 'object',
            additionalProperties: { type: 'string' }
        },
        transition: {
            type: 'object',
            additionalProperties: { type: 'string' }
        }
    },
    required: ['version', 'bodies', 'funcs', 'initialStatus', 'transition']
};

export const keywords = _.concat(FunctionKeywords, _.keys(ConstantCode), 'dt');

export type DefinitionErrors = Record<string, Errors>;

type SystemParsingResult = {
    asts: SystemStructure<TreeNode<ASTNode>>;
    errors: SystemErrors;
};

type SystemDeps = SystemStructure<string[]>;

type SymbolTable = Record<string, ValueCode>;

/**
 * 
 * @param data 
 * @param mapper 
 */
export function mapBodyPR<SP, SR, TP, TR>(
    data: BodyStructurePR<SP, SR>,
    mapperP: (arg0: SP) => TP,
    mapperR: (arg0: SR) => TR): BodyStructurePR<TP, TR> {
    const position = mapperP(data.position);
    const rotation = data.rotation ? mapperR(data.rotation) : undefined;
    return { position, rotation };
}

/**
 * 
 * @param data 
 * @param mapper 
 */
export function mapBody<T, R>(
    data: BodyStructure<T>,
    mapper: (arg0: T) => R): BodyStructure<R> {
    const position = mapper(data.position);
    const rotation = data.rotation ? mapper(data.rotation) : undefined;
    return { position, rotation };
}

/**
 * 
 * @param data 
 * @param mapper 
 */
export function mapBodies<T, R>(
    data: BodyStructure<T>[],
    mapper: (arg0: T) => R): BodyStructure<R>[] {
    const bodies = data.map(body => mapBody(body, mapper));
    return bodies;
}

/**
 * 
 * @param data 
 * @param mapper 
 */
export function mapBodiesPR<SP, SR, TP, TR>(
    data: BodyStructurePR<SP, SR>[],
    mapperP: (arg0: SP) => TP,
    mapperR: (arg0: SR) => TR): BodyStructurePR<TP, TR>[] {
    const bodies = data.map(body => mapBodyPR(body, mapperP, mapperR));
    return bodies;
}

/**
 * Returns the mapped system structure
 * @param sys the original system structure
 * @param mapper the mapper function
 */
function mapSystem<T, R>(sys: SystemStructure<T>, mapper: (arg0: T) => R): SystemStructure<R> {
    const bodies = mapBodies(sys.bodies, mapper);
    const funcs = _.mapValues(sys.funcs, mapper);
    const initialStatus = _.mapValues(sys.initialStatus, mapper);
    const transition = _.mapValues(sys.transition, mapper);
    return { bodies, funcs, initialStatus, transition };
}

/**
 * Returns the zipped system structure combining the nodes from two system structures
 * @param t the first structure
 * @param u  the second structure
 */
function zipSystemStructure<T, U>(t: SystemStructure<T>, u: SystemStructure<U>): SystemStructure<[T | undefined, U | undefined]> {
    function zip(t: Record<string, T>, u: Record<string, U>): Record<string, [T | undefined, U | undefined]> {
        const result = _([u, t])
            .flatMap(_.keys)
            .map(key => {
                const value: [T | undefined, U | undefined] = [t[key], u[key]];
                return [key, value] as [string, [T | undefined, U | undefined]];
            })
            .fromPairs()
            .value();
        return result;
    }
    const bodies = _.zip(t.bodies, u.bodies).map(([t1, u1]) => {
        const position: [T | undefined, U | undefined] = [t1?.position, u1?.position];
        const rotation: [T | undefined, U | undefined] | undefined =
            t1?.rotation !== undefined || u1?.rotation !== undefined ?
                [t1?.rotation, u1?.rotation] :
                undefined
        return { position, rotation };
    });
    const funcs = zip(t.funcs, u.funcs);
    const initialStatus = zip(t.initialStatus, u.initialStatus);
    const transition = zip(t.transition, u.transition);
    return { bodies, funcs, initialStatus, transition };
}

/**
* Returns the parsing result of a system definitions with the AST and errors
* @param sys the system definition
*/
export function parseSystemDefs(sys: SystemDefinition): SystemParsingResult {
    const parsed = mapSystem(sys, parse);
    const asts = mapSystem(parsed, node => node.ast);
    const errors = mapSystem(parsed, node => node.errors);
    return { asts, errors };
}

/**
 * 
 * @param keys 
 */
function idOnly(keys: string[]): string[] {
    return keys.filter(key =>
        !(keywords.indexOf(key) >= 0
            || kroneckerId(key) !== undefined
            || baseVectorId(key) !== undefined)
    )
}

/**
 * Returns the list of dependencies from an AST
 * @param ast the AST
 */
export function extractDependencies(ast: TreeNode<ASTNode>): string[] {
    const result = deepFirstFlatMap(ast, node => node)
        .map(node => {
            switch (node.type) {
                case ASTNodeType.Id:
                    return node.id;
                default:
                    return '';
            }
        })
        .filter(dep => !!dep)
        || [];
    return idOnly(result);
}

/**
 * Returns the system dependencies
 * @param sys the system parsing result
 */
export function dependencies(sys: SystemParsingResult): SystemDeps {
    return mapSystem(sys.asts, extractDependencies);
}

/**
 * 
 * @param sys 
 */
function symbolKeys(sys: SystemDeps) {
    return _.uniq(_.concat(_.keys(sys.funcs), _.keys(sys.initialStatus)));
}

/**
 * Returns the system errors concatenation
 * @param a the first system errors
 * @param b the second system errors
 */
function concatErrors(a: SystemErrors, b: SystemErrors): SystemErrors {
    const zipped = zipSystemStructure(a, b);
    const result = mapSystem(zipped, ([a, b]) => {
        return _.concat(a || [], b || []);
    });
    return result;
}

/**
 * Returns the undefined dependency errors
 * @param deps the dependencies
 */
export function undefinedDependencyErrors(deps: SystemDeps): SystemErrors {
    const keys = symbolKeys(deps);

    function depErrors(deps: string[]) {
        return _.difference(deps, keys).map(id => `${id} is not defined`);
    }

    return mapSystem(deps, depErrors);
}

/**
 * Returns the errors for start transition
 * @param sys the system parsing result
 */
export function transitionErrors(sys: SystemParsingResult): DefinitionErrors {
    const statusKeys = _.keys(sys.asts.initialStatus);
    const transitionKeys = _.keys(sys.asts.transition);
    const errorsKeys = _.difference(transitionKeys, statusKeys);
    const transition = _.mapValues(sys.asts.transition, (value, key) => {
        return errorsKeys.indexOf(key) >= 0 ? [`${key} is not an initial status`] : [];
    });
    return transition;
}

/**
 * 
 * @param map 
 */
export function closure(map: Record<string, string[]>): Record<string, string[]> {
    const allValues = _(map).toPairs().flatMap(([key, names]) => names).value();
    const names = _.uniq(_.concat(_.keys(map), allValues));
    const n = names.length;
    // Creates the adjacent matrix
    const closure = _.range(0, n).map(() => _.range(0, n).map(() => false));
    for (var ii = 0; ii < n; ii++) {
        const i = ii;
        const deps = map[names[i]] || [];
        deps.forEach(name => {
            closure[i][names.indexOf(name)] = true;
        });
    }
    // Computes closure with warshall's algorithm
    for (var k = 0; k < n; ++k) {
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < n; ++j) {
                if (closure[i][k] && closure[k][j]) {
                    closure[i][j] = true;
                }
            }
        }
    }
    const result = _(_.range(0, n)).map(i => {
        const to = _(_.range(0, n))
            .map(j => {
                return { to: names[j], value: closure[i][j] };
            })
            .filter({ value: true })
            .map('to')
            .value()
        return [names[i], to];
    })
        .fromPairs()
        .value();
    return result;
}

/**
 * 
 * @param args 
 * @param reducer 
 * @param indentity 
 */
function concatValues<T>(...args: Record<string, T[]>[]): Record<string, T[]> {
    const keys = _(args).flatMap(i => _.keys(i));
    const x = keys.map(key => {
        const values = _(args).flatMap(m => m[key] || []).value()
        return [key, values] as [string, T[]];
    })
        .fromPairs()
        .value();
    return x;
}

/**
 * 
 * @param deps 
 */
export function circularErrors(deps: SystemDeps): SystemErrors {
    function circRef(deps: Record<string, string[]>): string[] {
        const close = closure(deps);
        const result = _(close)
            .toPairs()
            .filter(([k, v]) => v.indexOf(k) >= 0)
            .map(x => x[0])
            .value();
        return result;
    }

    function circErrors(refs: string[]): Record<string, string[]> {
        return _(refs)
            .map(id => [id, [`${id} is a circular reference`]] as [string, string[]])
            .fromPairs()
            .value();
    }

    const circ1 = circRef(concatValues(deps.funcs, deps.initialStatus));
    const initialStatus = circErrors(_.intersection(circ1, _.keys(deps.initialStatus)));
    const funcs = circErrors(_.intersection(circ1, _.keys(deps.funcs)));
    return { bodies: [], initialStatus, funcs, transition: {} };
}

/**
 * 
 * @param deps 
 */
export function funcStatusErrors(deps: SystemDeps): DefinitionErrors {
    const funcsDefs = _.intersection(_.keys(deps.funcs), _.keys(deps.initialStatus));
    const funcs = _(funcsDefs)
        .map(id => [id, [`${id} is a status variable`]])
        .fromPairs()
        .value();
    return funcs;
}

/**
 * Returns the ordered symbols of a DAG tree
 * Each symbol appears before any other reference to it
 * @param deps
 */
export function orderedDependencies(deps: Record<string, string[]>): string[] {

    function deepFirstTraverse(node: string, acc: string[]): string[] {
        if (acc.indexOf(node) >= 0) {
            return acc;
        } else {
            const deps1 = deps[node];
            if (deps1) {
                const acc1 = _(deps1).reduce((a, n) => deepFirstTraverse(n, a), acc);
                return _.concat(acc1, node);
            } else {
                return _.concat(acc, node);
            }
        }
    }

    const dagKeys = _.keys(deps);
    const orderedKeys = _.reduce(dagKeys,
        (acc, node) => deepFirstTraverse(node, acc),
        [] as string[]);
    return orderedKeys;
}

interface CodeGenResult {
    table: SymbolTable;
    errors: SystemErrors;
}

/**
 * Returns the semantic analysis of an ast map related to a variable resolver.
 * It check for missing definitions, cycle references, semantic source code errors.
 * @param astsMap the asts map
 * @param resolver the variable resolver 
 */
function codeGen(astsMap: Record<string, TreeNode<ASTNode>>, resolver: Record<string, ValueCode>) {
    const symbolDeps = _.mapValues(astsMap, extractDependencies);
    // extracts the keys of status + functions
    const symbolKeys = _.keys(symbolDeps);
    const clos = closure(symbolDeps);
    // Creates the cycled symbols
    const loopKeys = _(clos)
        .toPairs()
        .filter(([k, v]) => v.indexOf(k) >= 0)
        .map(([k, v]) => k)
        .value();
    // Creates the acycled symbols
    const dagKeys = _.difference(symbolKeys, loopKeys);
    // Creates the acycled dependencies
    const dagDeps = _(dagKeys)
        .map(k => [k, symbolDeps[k]] as [string, string[]])
        .fromPairs()
        .value();
    // creates the order of resolution of symbols
    const orderedKeys = orderedDependencies(dagDeps);

    // generates the symbol table for the cycle symbols (seed for code generation)
    const loopSymbolTable: SymbolTable = _(loopKeys).map(key => {
        return [key, numberCode(0)] as [string, ValueCode];
    })
        .fromPairs()
        .value();
    const seedTable = _.assign({}, loopSymbolTable, resolver);

    // generates the errors of cycle symbols (seed of code generation)
    const loopErrors = _(loopKeys).map(key => {
        return [key, [`"${key}" is a cycle reference`]] as [string, string[]];
    })
        .fromPairs()
        .value();

    // add the missing references errors
    const allRef = _(symbolDeps).values().flatten().uniq().value();
    const missingRef = _.difference(allRef, symbolKeys, _.keys(resolver));
    const missingRefErrors = _(symbolDeps)
        .mapValues((deps, key) =>
            deps.filter(d => missingRef.indexOf(d) >= 0).map(id => `"${id}" is not defined`)
        )
        .value();
    const seedErrors = concatValues(loopErrors, missingRefErrors);

    // generates the symbol table and error ordered by symbol resolution
    const result = _(orderedKeys).reduce((res, key) => {
        const { table, errors } = res;
        if (table[key] !== undefined) {
            return res;
        }
        const ast = astsMap[key];
        const ttable = _.clone(table);
        if (ast !== undefined) {
            const ctx = createCodeGenContext(table);
            const ctx1 = expressionCodeGen(ctx, ast);
            ttable[key] = ctx1.typeCode;
            const terrors = _.clone(errors);
            terrors[key] = _.concat(terrors[key] ?? [], ctx1.errors);
            return { table: ttable, errors: terrors };
        } else {
            ttable[key] = DefaultScalarCode;
            return { table: ttable, errors };
        }
    }, {
        table: seedTable,
        errors: seedErrors
    });
    return result;
}

/**
 * Returns the sematic analysis of functions and initial values of
 * status variable and related errors.
 * It checks for missing definition, circular reference,
 * inconsistencies between operators and type of expressions.
 * @param sys 
 */
export function statusCodeGen(sys: SystemParsingResult): CodeGenResult {
    const astMaps = _.fromPairs(_.concat(
        _.toPairs(sys.asts.funcs),
        _.toPairs(sys.asts.initialStatus)));
    const { table, errors } = codeGen(astMaps, { dt: numberCode(0) });
    // convert the errors to system errors
    const sysErrors: SystemErrors = {
        bodies: [],
        funcs: _(sys.asts.funcs).mapValues((v, k) => errors[k] ?? []).value(),
        initialStatus: _(sys.asts.initialStatus).mapValues((v, k) => errors[k] ?? []).value(),
        transition: {}
    }
    // extract the symbol table for status only
    const statusTable = _(sys.asts.initialStatus)
        .mapValues((v, k) => table[k])
        .value();

    return { table: statusTable, errors: sysErrors };
}

/**
 * 
 * @param ctx 
 * @param node 
 */
function nodeCodeGen(ctx: CodeGenContext, node: TreeNode<ASTNode>) {
    const result = expressionCodeGen(ctx, node);
    // Check for missng references
    const deps = extractDependencies(node);
    const depErrors = deps
        .filter(id => ctx.symbol(id) === undefined)
        .map(id => `"${id}" is not defined`);
    return depErrors.length > 0 ? result.addErrors(depErrors) : result;
}

const DefaultPosition = vector0Code(3);
const DefaultRotation = DefaultQuaternionCode;

/**
 * Returns the sematic analysis of the state of bodies 
 * It checks for missing definitions, circular reference,
 * inconsistencies between operators and type of expressions
 * wrong types of body properties (position, rotation).
 * @param sys 
 * @param statusTable
 */
export function bodiesCodeGen(sys: SystemParsingResult, statusTable: SymbolTable) {
    // gets the asts map for function resolution
    const astMaps = sys.asts.funcs;

    // create the status variable resolver
    const varsTable = _(statusTable)
        .mapValues((v, k) => {
            switch (v.type) {
                case ValueTypeCode.Scalar:
                    return refScalarCode(k);
                case ValueTypeCode.Quaternion:
                    return refQuaternionCode(k);
                case ValueTypeCode.Vector:
                    return refVectorCode(k, v.rows);
                case ValueTypeCode.Matrix:
                    return refMatrixCode(k, v.rows, v.cols);
            }
        })
        .value();
    const varsTable1 = _.defaults({ dt: numberCode(0) }, varsTable);

    // analyzes functions
    const { table } = codeGen(astMaps, varsTable1);
    const ctx = createCodeGenContext(table);

    // generate code for bodies status
    const bodiesCodeCtx = mapBodiesPR(sys.asts.bodies,
        position => {
            const posCodeCtx = nodeCodeGen(ctx, position);
            const { typeCode: posTypeCode } = posCodeCtx;
            const posCodeCtx1 = isVectorCode(posTypeCode) && posTypeCode.rows === 3 ?
                posCodeCtx :
                posCodeCtx
                    .withTypeCode(DefaultPosition)
                    .addErrors(errorByCode('vector3 expected', posTypeCode));
            return posCodeCtx1;
        },
        rotation => {
            const rotCodeCtx = nodeCodeGen(ctx, rotation);
            const rotCodeCtx1 = isQuaternionCode(rotCodeCtx.typeCode) ?
                rotCodeCtx :
                rotCodeCtx
                    .withTypeCode(DefaultRotation)
                    .addErrors(errorByCode('quaternion expected', rotCodeCtx.typeCode));
            return rotCodeCtx1;
        });
    const code = mapBodiesPR(
        bodiesCodeCtx,
        ctx => {
            if (!isVectorCode(ctx.typeCode)) {
                throw new Error('Worng type');
            }
            return ctx.typeCode
        },
        ctx => {
            if (!isQuaternionCode(ctx.typeCode)) {
                throw new Error('Worng type');
            }
            return ctx.typeCode
        },
    );

    const bodiesErrors = mapBodies(bodiesCodeCtx, ctx => ctx.errors);

    const sysErrors: SystemErrors = {
        bodies: bodiesErrors,
        funcs: {},
        initialStatus: {},
        transition: {}
    }
    return { code, errors: sysErrors };
}

/**
 * Returns the sematic analysis of state transitions.
 * It checks for missing definitions,
 * inconsistencies between operators and type of expressions
 * inconsistency with state definition (type and dimensins)
 * @param sys 
 * @param statusTable
 */
export function transitionCodeGen(sys: SystemParsingResult, statusTable: SymbolTable) {
    // gets the asts map for function resolution
    const astMaps = sys.asts.funcs;

    // create the status variable resolver
    const varsTable = _(statusTable)
        .mapValues((v, k) => {
            switch (v.type) {
                case ValueTypeCode.Scalar:
                    return refScalarCode(k);
                case ValueTypeCode.Quaternion:
                    return refQuaternionCode(k);
                case ValueTypeCode.Vector:
                    return refVectorCode(k, v.rows);
                case ValueTypeCode.Matrix:
                    return refMatrixCode(k, v.rows, v.cols);
            }
        })
        .value();
    const varsTable1 = _.defaults({ dt: refScalarCode('dt') }, varsTable);

    // analyzes functions
    const { table } = codeGen(astMaps, varsTable1);
    const ctx = createCodeGenContext(table);

    // generate code for transition status
    const ctxMap = _(sys.asts.transition).mapValues((ast, key) => {
        const ctx1 = nodeCodeGen(ctx, ast);
        const { typeCode } = ctx1;
        const st = statusTable[key];
        if (!st) {
            return ctx1.addErrors([`"${key}" is not a status variable`]);
        }
        if (isScalarCode(st)) {
            return isScalarCode(typeCode) ?
                ctx1 :
                ctx1.addErrors(errorByCode('scalar expected', typeCode))
                    .withTypeCode(DefaultScalarCode);
        }
        if (isQuaternionCode(st)) {
            return isQuaternionCode(typeCode) ?
                ctx1 :
                ctx1.addErrors(errorByCode('quaternion expected', typeCode))
                    .withTypeCode(DefaultQuaternionCode);
        }
        if (isVectorCode(st)) {
            return isVectorCode(typeCode) && typeCode.rows === st.rows ?
                ctx1 :
                ctx1.addErrors(errorByCode(`vector${st.rows} expected`, typeCode))
                    .withTypeCode(vector0Code(st.rows));
        }
        if (isMatrixCode(st)) {
            return isMatrixCode(typeCode) && typeCode.rows === st.rows && typeCode.cols === st.cols ?
                ctx1 :
                ctx1.addErrors(errorByCode(`matrix${st.rows}x${st.cols} expected`, typeCode))
                    .withTypeCode(matrix0Code(st.rows, st.cols));
        }
        throw new Error('unexpected branch');
    })
        .value();

    // extracts to errors
    const sysErrors: SystemErrors = {
        bodies: [],
        funcs: {},
        initialStatus: {},
        transition: _.mapValues(ctxMap, 'errors')
    }

    // Filter status variables
    const code = _(ctxMap)
        .mapValues('typeCode')
        .toPairs()
        .filter(([k, v]) => statusTable[k] !== undefined)
        .fromPairs()
        .value();

    return { code, errors: sysErrors };
}

/**
 * 
 */
export function validateSystemDefinition(json: any): json is SystemDefinition {
    new Validator().validate(json, SystemDefinitionSchema, { throwError: true });

    // Current supported version
    const cpatt = CurrentSysDefVersion.match(VersionPattern);
    const vpatt = json.version.match(VersionPattern);
    if ((vpatt === null || cpatt === null
        || vpatt[1] !== cpatt[1]
        || parseInt(vpatt[2]) > parseInt(cpatt[2]))) {
        throw new Error(`version ${json.version} is not compatible with supported version ${CurrentSysDefVersion}`);
    }
    return true;
}

/**
 * @param sys 
 */
export function compile(sys: SystemDefinition): CompilerResult {

    /** Parsing phase */
    const parsed = parseSystemDefs(sys);
    /** Building symbol tables for status */
    const { table: statusTable, errors: statusErrors } = statusCodeGen(parsed);
    /** Building symbol tables for bodies */
    const { code: bodiesTable, errors: bodiesErrors } = bodiesCodeGen(parsed, statusTable);
    /** Building symbol tables for transition */
    const { code: transitionTable, errors: transitionErrors } = transitionCodeGen(parsed, statusTable);

    const statusCode = _.mapValues(statusTable, 'code');
    const bodiesCode = mapBodiesPR(bodiesTable,
        typeCode => typeCode.code,
        typeCode => typeCode.code);
    const transitionCode = _.mapValues(transitionTable, 'code');

    // Linking
    const initialStatus: () => Record<string, AnyValue> = () => {
        const ctx = { dt: 0 };
        return _.mapValues(statusCode, code => code(ctx));
    };
    const bodies: (ctx: Record<string, AnyValue>) => BodyStatus[] = ctx => {
        const ctx1 = _.assign({ dt: 0 }, ctx);
        return mapBodiesPR(bodiesCode,
            code => code(ctx1),
            code => code(ctx1));
    };
    const next: (ctx: Record<string, AnyValue>, dt: number) => Record<string, AnyValue> =
        (ctx, dt) => {
            const ctx1 = _.assign({ dt }, ctx);
            const next = _.mapValues(transitionCode, code => code(ctx1));
            const result = _.defaults(next, ctx);
            return result;
        };

    // Aggregates errors
    const errors = concatErrors(
        parsed.errors,
        concatErrors(
            statusErrors,
            concatErrors(
                bodiesErrors,
                transitionErrors)));

    return {
        rules: { bodies, initialStatus, next },
        errors
    };
}
