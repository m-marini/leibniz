import _ from "lodash";
const Lexer = require('lex');

/***********************************************************/
/* Lexer                                                   */
/***********************************************************/

const IdentifierRegex = /[a-zA-Z_][a-zA-Z0-9_]*/;
const NumberRegex = /\d+\.?\d*/;
const ExpNumberRegex = /\d+\.?\d*[eE][+-]?\d+/;
const SingleIdentifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const BaseVectorRegex = /^e(\d+)$/;
const KroneckerRegex = /^I(\d+)$/;

const Keywords = [
    'sin',
    'cos',
    'tan',
    'asin',
    'acos',
    'atan',
    'sinh',
    'cosh',
    'tanh',
    'exp',
    'log',
    'sqrt',
    'T',
    'qrot',
    'tr',
    'n',
    'cyl',
    'sphere',
    'cyl1',
    'sphere1',
    'inv',
    'det',
    'min',
    'max',
    'PI',
    'e',
    'i',
    'j',
    'k',
    'dt',
    'ex',
    'ey',
    'ez'
];

export enum TokenType {
    Number = 'number',
    Id = 'identifier',
    Symbol = 'symbol'
}

export interface AbstractToken {
    text: string;
}

export interface NumberToken extends AbstractToken {
    type: TokenType.Number;
}

export interface IdToken extends AbstractToken {
    type: TokenType.Id,
}

export interface SymbolToken extends AbstractToken {
    type: TokenType.Symbol,
}

export type Token = NumberToken | IdToken | SymbolToken;

/**
 * Returns the dimension of base vactor id or undefined if it is not
 * @param name 
 */
export function baseVectorId(name: string): string | undefined {
    const m = BaseVectorRegex.exec(name);
    return m && m.length >= 2 ? m[1] : undefined;
}

/**
 * Returns the dimension of kroneker id or undefined if it is not
 * @param name 
 */
export function kroneckerId(name: string): string | undefined {
    const m = KroneckerRegex.exec(name);
    return m && m.length >= 2 ? m[1] : undefined;
}

/**
 * 
 * @param name 
 */
export function identifierError(name: string): string | undefined {
    if (!name.match(SingleIdentifierRegex)) {
        return 'Name "' + name + '" must be an identifier';
    } else if (Keywords.indexOf(name) >= 0) {
        return 'Name "' + name + '" must not be a keyword';
    } else if (baseVectorId(name) !== undefined) {
        return 'Name "' + name + '" must not be a vector base keyword';
    } else if (kroneckerId(name) !== undefined) {
        return 'Name "' + name + '" must not be a kroneker keyword';
    } else {
        return undefined;
    }
}

export function toTokens(text: string): Token[] {
    if (text === undefined) {
        throw new Error('text undefined');
    }
    const lexer = new Lexer();
    lexer.addRule(ExpNumberRegex, (lexeme: string): NumberToken => {
        return {
            type: TokenType.Number,
            text: lexeme
        };
    })
        .addRule(NumberRegex, (lexeme: string): NumberToken => {
            return {
                type: TokenType.Number,
                text: lexeme
            }
        }).addRule(IdentifierRegex, (lexeme: string): IdToken => {
            return {
                type: TokenType.Id,
                text: lexeme
            }
        })
        .addRule(/\s/, () => undefined)
        .addRule(/./, (lexeme: string): SymbolToken => {
            return {
                type: TokenType.Symbol,
                text: lexeme
            }
        });

    const tokens: Token[] = [];
    lexer.input = text;
    for (; ;) {
        const r: Token = lexer.lex();
        if (r) {
            tokens.push(r);
        } else {
            break;
        }
    }
    return tokens;
};


/**
 * 
 * @param tok 
 */
function isSymbol(tok: Token): tok is SymbolToken {
    return tok.type === TokenType.Symbol;
}

function isNumber(tok: Token): tok is NumberToken {
    return tok.type === TokenType.Number;
}

function isIdentifier(tok: Token): tok is IdToken {
    return tok.type === TokenType.Id;
}

/***********************************************************/
/* AST definitions                                         */
/***********************************************************/

export interface TreeNode<T> {
    node: T;
    children: TreeNode<T>[];
}

/**
 * 
 * @param tree 
 * @param mapper 
 */
export function mapTree<T, R>(tree: TreeNode<T>, mapper: (arg: T) => R): TreeNode<R> {
    function map(tree: TreeNode<T>): TreeNode<R> {
        const node = mapper(tree.node);
        const children = tree.children.map(map);
        return { node, children };
    }
    return map(tree);
}

/**
 * 
 * @param tree 
 * @param mapper 
 */
export function deepFirstFlatMap<T, R>(tree: TreeNode<T>, mapper: (arg: T) => R): R[] {
    function flatMap(tree: TreeNode<T>): R[] {
        const node = mapper(tree.node);
        const children = _.flatMap(tree.children, flatMap);
        return _.concat(children, node);
    }
    return flatMap(tree);
}

/**
 * 
 * @param tree 
 * @param mapper 
 */
export function deepLastFlatMap<T, R>(tree: TreeNode<T>, mapper: (arg: T) => R): R[] {
    function flatMap(tree: TreeNode<T>): R[] {
        const node = mapper(tree.node);
        const children = _.flatMap(tree.children, flatMap);
        return _.concat([node], children);
    }
    return flatMap(tree);
}

/**
 * 
 * @param tree 
 * @param predicate 
 */
export function filterTree<T>(tree: TreeNode<T>, predicate: (arg: T) => boolean): TreeNode<T> | undefined {
    function filter(tree: TreeNode<T>): TreeNode<T> | undefined {
        if (predicate(tree.node)) {
            const children = tree.children
                .map(filter)
                .filter(node => node !== undefined)
                .map(node => node as TreeNode<T>)
            return children.length > 0 ? { node: tree.node, children } : undefined
        } else {
            return undefined;
        }
    }
    return filter(tree);
}

export enum ASTNodeType {
    Id = 'id',
    Number = 'number',
    Sym = 'sym',
    End = 'end',
    Rule = 'rule'
};

interface IdNode {
    type: ASTNodeType.Id;
    id: string;
}

interface NumberNode {
    type: ASTNodeType.Number;
    value: string;
}

interface SymbolNode {
    type: ASTNodeType.Sym;
    symbol: string;
}

interface EndNode {
    type: ASTNodeType.End
}

export interface RuleNode {
    type: ASTNodeType.Rule;
    rule: string;
}

export type ASTNode = IdNode | NumberNode | SymbolNode | EndNode | RuleNode;

export const endAST: TreeNode<ASTNode> = {
    node: {
        type: ASTNodeType.End
    },
    children: []
};

/**
 * 
 * @param id 
 */
export function createIdAST(id: string): TreeNode<ASTNode> {
    return {
        node: { type: ASTNodeType.Id, id },
        children: []
    };
}

/**
 * 
 * @param value 
 */
export function createNumberAST(value: string): TreeNode<ASTNode> {
    return {
        node: { type: ASTNodeType.Number, value },
        children: []
    };
}

/**
 * 
 * @param symbol 
 */
export function createSymbolAST(symbol: string): TreeNode<ASTNode> {
    return {
        node: { type: ASTNodeType.Sym, symbol },
        children: []
    };
}

/**
 * 
 * @param rule 
 * @param node 
 */
export function createOptionalAST(rule: string, node?: TreeNode<ASTNode>): TreeNode<ASTNode> {
    return {
        node: { type: ASTNodeType.Rule, rule },
        children: node ? [node] : []
    };
}

/**
 * 
 * @param rule 
 * @param seq 
 */
export function createSeqAST(rule: string, children: TreeNode<ASTNode>[]): TreeNode<ASTNode> {
    return {
        node: { type: ASTNodeType.Rule, rule },
        children
    };
}

/**
 * 
 * @param rule 
 * @param nodes 
 */
export function createRepeatAST(rule: string, children: TreeNode<ASTNode>[]): TreeNode<ASTNode> {
    return {
        node: { type: ASTNodeType.Rule, rule },
        children
    };
}

/**
 * 
 */
export const DefaultASTNode = createSeqAST('expression', [
    createSeqAST('expr', [
        createSeqAST('sum', [
            createSeqAST('factor', [
                createSeqAST('unary', [
                    createRepeatAST('unary-op*', []),
                    createSeqAST('pow', [
                        createNumberAST('0'),
                        createRepeatAST('pow-suffix*', [
                        ])
                    ])
                ]),
                createRepeatAST('factor-suffix*', [])
            ]),
            createRepeatAST('sum-suffix*', [])
        ]),
        createRepeatAST('expr-suffix*', [])
    ]),
    endAST
]);


/***********************************************************/
/* Syntax definitions                                      */
/***********************************************************/

export class SyntaxParserContext {
    private _tokens: Token[];
    private _current: number;
    private _errors: string[];
    private _node: TreeNode<ASTNode> | undefined;
    private _rules: Record<string, SyntaxRule>;

    constructor(rules: Record<string, SyntaxRule>, tokens: Token[], current: number = 0, node?: TreeNode<ASTNode>, errors: string[] = []) {
        this._rules = rules;
        this._tokens = tokens;
        this._current = current;
        this._errors = errors;
        this._node = node;
    }

    get tokens() { return this._tokens; }
    get current() { return this._current; }
    get errors() { return this._errors; }
    get node() { return this._node; }
    get rules() { return this._rules; }

    /**
     * 
     * @param id 
     */
    rule(id: string): SyntaxRule | undefined { return this.rules[id]; }

    /**
     * 
     */
    token(): Token | undefined {
        const { tokens, current } = this;
        return current < tokens.length ? tokens[current] : undefined;
    }

    /**
     * 
     */
    next(): SyntaxParserContext {
        const { tokens, current } = this;
        return current < tokens.length ?
            new SyntaxParserContext(this.rules, tokens, current + 1, this.node, this.errors) :
            this;
    }

    /**
     * 
     * @param node 
     */
    withNode(node: TreeNode<ASTNode> | undefined): SyntaxParserContext {
        return new SyntaxParserContext(this.rules, this.tokens, this.current, node, this.errors);
    }

    /**
     * 
     * @param errors 
     */
    withErrors(errors: string[]): SyntaxParserContext {
        return new SyntaxParserContext(this.rules, this.tokens, this.current, this.node, errors);
    }

    /**
     * 
     * @param error 
     */
    addError(error: string): SyntaxParserContext {
        const pos = this.token()?.text || '<EOT>';
        return this.withErrors(_.concat(this.errors, `${error}, found ${pos}`));
    }
}

/**
 * 
 * @param syntax 
 * @param text 
 */
export function buildSyntaxParserContext(text: string, syntax: Record<string, SyntaxRule> = systemSyntax) {
    const tokens = toTokens(text);
    return new SyntaxParserContext(syntax, tokens);
}

type SyntaxRule = (ctx: SyntaxParserContext) => SyntaxParserContext;

/**
 *
 * @param ctx
 */
export const IdExpr: SyntaxRule = ctx => {
    const tok = ctx.token();
    if (!tok) {
        return ctx.addError('<id> expected');
    }
    if (!isIdentifier(tok)) {
        return ctx.addError('<id> expected');
    }
    const node = createIdAST(tok.text);
    return ctx.next().withNode(node);
};

/**
 * 
 * @param keyword 
 */
export function keywordExpr(keyword: string): SyntaxRule {
    return ctx => {
        const tok = ctx.token();
        if (!tok || !isIdentifier(tok) || tok.text !== keyword) {
            return ctx.addError(`${keyword} expected`);
        }
        const node = createIdAST(tok.text);
        return ctx.next().withNode(node);
    };
}

/**
 * 
 * @param ctx 
 */
export const NumberExpr: SyntaxRule = ctx => {
    const tok = ctx.token();
    if (!tok) {
        return ctx.addError('<number> expected');
    }
    if (!isNumber(tok)) {
        return ctx.addError('<number> expected');
    }
    const node = createNumberAST(tok.text);
    return ctx.next().withNode(node);
};

/**
 * 
 * @param ctx 
 */
export const endExpr: SyntaxRule = ctx => {
    const tok = ctx.token();
    return tok ?
        ctx.addError('<EOF> expected') :
        ctx.withNode(endAST);
};

/**
 * 
 * @param symbol 
 */
export function symbolExpr(symbol: string): SyntaxRule {
    return ctx => {
        const tok = ctx.token();
        if (!tok || !isSymbol(tok) || tok.text !== symbol) {
            return ctx.addError(`${symbol} expected`);
        }
        const node = createSymbolAST(symbol);
        return ctx.next().withNode(node);
    };
}

/**
 * 
 * @param rule 
 */
export function nonTermExpr(rule: string): SyntaxRule {
    return ctx => {
        const r = ctx.rule(rule);
        return !!r ?
            r(ctx) :
            ctx.addError(`Rule <${rule}> not found`);
    }
}

/**
 * 
 * @param id 
 * @param seq 
 */
export function seqExpr(id: string, ...seq: SyntaxRule[]): SyntaxRule {
    return ctx => {
        var nodes: TreeNode<ASTNode>[] = [];
        var ctx1 = ctx;
        for (var i = 0; i < seq.length; i++) {
            const ctx2 = seq[i](ctx1);
            if (ctx2.errors.length > ctx1.errors.length) {
                // Invalid expression
                return ctx2.addError(`<${id}> expected`);
            }
            if (ctx2.node) {
                nodes.push(ctx2.node);
            }
            ctx1 = ctx2;
        }
        const node = createSeqAST(id, nodes);
        return ctx1.withNode(node);
    };
}

/**
 * 
 * @param id 
 * @param alts 
 */
export function altExpr(id: string, ...alts: SyntaxRule[]): SyntaxRule {
    return ctx => {
        for (var i = 0; i < alts.length; i++) {
            const ctx1 = alts[i](ctx);
            if (ctx1.errors.length === ctx.errors.length) {
                return ctx1;
            }
        }
        // Invalid expression
        return ctx.addError(`<${id}> expected`);
    };
}

/**
 * 
 * @param id 
 * @param opt 
 */
export function optExpr(id: string, opt: SyntaxRule): SyntaxRule {
    return ctx => {
        const ctx1 = opt(ctx);
        if (ctx1.errors.length > ctx.errors.length) {
            // Invalid expression
            return ctx.withNode(createOptionalAST(id));
        }
        const node = createOptionalAST(id, ctx1.node);
        return ctx1.withNode(node);
    };
}

/**
 * 
 * @param id 
 * @param rule 
 */
export function repeatExpr(id: string, rule: SyntaxRule): SyntaxRule {
    return ctx => {
        const nodes: TreeNode<ASTNode>[] = [];
        var ctx1 = ctx;
        for (; ;) {
            const ctx2 = rule(ctx1);
            if (ctx2.errors.length !== ctx1.errors.length) {
                break;
            }
            if (ctx2.node) {
                nodes.push(ctx2.node);
            }
            ctx1 = ctx2;
        }
        const node = createRepeatAST(id, nodes);
        return ctx1.withNode(node);
    };
}

/**
 * 
 */
export const systemSyntax: Record<string, SyntaxRule> = {
    'expression': seqExpr('expression',
        nonTermExpr('expr'),
        endExpr
    ),
    'expr': seqExpr('expr',
        nonTermExpr('sum'),
        nonTermExpr('expr-suffix*')
    ),
    'expr-suffix*': repeatExpr('expr-suffix*',
        seqExpr('expr-suffix',
            altExpr('expr-op',
                symbolExpr(',')
            ),
            nonTermExpr('sum')
        )
    ),
    'sum': seqExpr('sum',
        nonTermExpr('factor'),
        nonTermExpr('sum-suffix*')
    ),
    'sum-suffix*': repeatExpr('sum-suffix*',
        seqExpr('sum-suffix',
            altExpr('sum-op',
                symbolExpr('+'),
                symbolExpr('-')
            ),
            nonTermExpr('factor')
        )
    ),
    'factor': seqExpr('factor',
        nonTermExpr('unary'),
        nonTermExpr('factor-suffix*')
    ),
    'factor-suffix*': repeatExpr('factor-suffix*',
        seqExpr('factor-suffix',
            altExpr('factor-op',
                symbolExpr('*'),
                symbolExpr('/')
            ),
            nonTermExpr('unary')
        )
    ),
    'unary': seqExpr('unary',
        repeatExpr('unary-op*',
            altExpr('unary-op',
                symbolExpr('+'),
                symbolExpr('-'),
                keywordExpr('sin'),
                keywordExpr('cos'),
                keywordExpr('tan'),
                keywordExpr('asin'),
                keywordExpr('acos'),
                keywordExpr('atan'),
                keywordExpr('sinh'),
                keywordExpr('cosh'),
                keywordExpr('tanh'),
                keywordExpr('exp'),
                keywordExpr('log'),
                keywordExpr('sqrt'),
                keywordExpr('T'),
                keywordExpr('qrot'),
                keywordExpr('tr'),
                keywordExpr('n'),
                keywordExpr('cyl'),
                keywordExpr('sphere'),
                keywordExpr('cyl1'),
                keywordExpr('sphere1'),
                keywordExpr('inv'),
                keywordExpr('det'),
                keywordExpr('min'),
                keywordExpr('max')
            )
        ),
        nonTermExpr('pow')
    ),
    'pow': seqExpr('pow',
        nonTermExpr('terminal'),
        nonTermExpr('pow-suffix*'),
    ),
    'pow-suffix*': repeatExpr('pow-suffix*',
        seqExpr('pow-suffix',
            symbolExpr('^'),
            nonTermExpr('terminal'))
    ),
    'terminal': altExpr('terminal',
        NumberExpr,
        IdExpr,
        nonTermExpr('bracket'),
        nonTermExpr('module')
    ),
    'bracket': seqExpr('bracket',
        symbolExpr('('),
        nonTermExpr('expr'),
        symbolExpr(')')
    ),
    'module': seqExpr('module',
        symbolExpr('|'),
        nonTermExpr('expr'),
        symbolExpr('|')
    )
}

export interface ParsingResult {
    ast: TreeNode<ASTNode>;
    errors: string[];
}

/**
 * 
 * @param text 
 */
export function parse(text: string): ParsingResult {
    const ctx = systemSyntax.expression(buildSyntaxParserContext(text));
    const ast = ctx.errors.length > 0 || ctx.node === undefined ? DefaultASTNode : ctx.node;
    return {
        ast,
        errors: ctx.errors
    };
}