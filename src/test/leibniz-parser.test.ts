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

import {
    buildSyntaxParserContext, IdExpr, SyntaxParserContext, TokenType, toTokens, TreeNode,
    ASTNode, DefaultASTNode, NumberExpr, optExpr, createOptionalAST, seqExpr, createIdAST,
    createNumberAST, createSeqAST, altExpr, createRepeatAST, repeatExpr, nonTermExpr,
    symbolExpr, createSymbolAST, endAST, baseVectorId, kroneckerId, parse
} from "../modules/leibniz-parser";
import _ from 'lodash';

describe('extended id', () => {
    _.range(0, 20).forEach(n => {
        test(`e${n}`, () => {
            const result = baseVectorId(`e${n}`);
            expect(result).toBe(`${n}`);
        });
        test(`e${n}a`, () => {
            const result = baseVectorId(`e${n}a`);
            expect(result).toBe(undefined);
        });
        test(`I${n}`, () => {
            const result = kroneckerId(`I${n}`);
            expect(result).toBe(`${n}`);
        });
        test(`I${n}a`, () => {
            const result = kroneckerId(`I${n}a`);
            expect(result).toBe(undefined);
        });
    });
});

describe('toToken', () => {
    test('should parse empty string', () => {
        const result = toTokens('');
        expect(result).toEqual([]);
    });

    test('should parse string', () => {
        const result = toTokens('a +- 1 12 12.34 12.34e56 12.34e-56 12.34e+56 12.34E56 12.34E-56 12.34E+56');
        expect(result).toEqual([{
            type: TokenType.Id,
            text: 'a'
        }, {
            type: TokenType.Symbol,
            text: '+'
        }, {
            type: TokenType.Symbol,
            text: '-'
        }, {
            type: TokenType.Number,
            text: '1'
        }, {
            type: TokenType.Number,
            text: '12'
        }, {
            type: TokenType.Number,
            text: '12.34'
        }, {
            type: TokenType.Number,
            text: '12.34e56'
        }, {
            type: TokenType.Number,
            text: '12.34e-56'
        }, {
            type: TokenType.Number,
            text: '12.34e+56'
        }, {
            type: TokenType.Number,
            text: '12.34E56'
        }, {
            type: TokenType.Number,
            text: '12.34E-56'
        }, {
            type: TokenType.Number,
            text: '12.34E+56'
        }]);
    });
});

interface TestCase {
    text: string;
    current: number;
    node: TreeNode<ASTNode>;
    errors: string[];
};

function testCases(
    cases: TestCase[],
    f: (arg: { testCase: TestCase, ctx: SyntaxParserContext }) => void) {
    cases.forEach(testCase => {
        const ctx = buildSyntaxParserContext(testCase.text);
        f({ ctx, testCase });
    });
}

const IdNode = createIdAST('id');
const Num2Node = createNumberAST('2');

describe('test number', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: ['<number> expected, found <EOT>']
    }, {
        text: '2',
        current: 1,
        node: Num2Node,
        errors: []
    }, {
        text: 'id',
        current: 0,
        node: DefaultASTNode,
        errors: ['<number> expected, found id']
    }, {
        text: '*',
        current: 0,
        node: DefaultASTNode,
        errors: ['<number> expected, found *']
    }], ({ ctx, testCase }) => {

        test(`[${testCase.text}]`, () => {
            const result = NumberExpr(ctx);
            expect(result.current).toEqual(testCase.current);
            if (testCase.errors.length === 0) {
                expect(result.node).toEqual(testCase.node);
            }
            expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test id', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: ['<id> expected, found <EOT>']
    }, {
        text: '2',
        current: 0,
        node: DefaultASTNode,
        errors: ['<id> expected, found 2']
    }, {
        text: 'id',
        current: 1,
        node: IdNode,
        errors: []
    }, {
        text: '*',
        current: 0,
        node: DefaultASTNode,
        errors: ['<id> expected, found *']
    }], ({ ctx, testCase }) => {

        test(`[${testCase.text}]`, () => {
            const result = IdExpr(ctx);
            expect(result.current).toEqual(testCase.current);
            if (testCase.errors.length === 0) {
                expect(result.node).toEqual(testCase.node);
            }
           expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test optional expr', () => {
    const expr = optExpr('optional', NumberExpr);
    const emptyOptNode = createOptionalAST('optional');
    testCases([{
        text: '',
        current: 0,
        node: emptyOptNode,
        errors: []
    }, {
        text: '2',
        current: 1,
        node: createOptionalAST('optional', Num2Node),
        errors: []
    }, {
        text: 'id',
        current: 0,
        node: emptyOptNode,
        errors: []
    }, {
        text: '*',
        current: 0,
        node: emptyOptNode,
        errors: []
    }], ({ ctx, testCase }) => {

        test(`[${testCase.text}]`, () => {
            const result = expr(ctx);
            expect(result.current).toEqual(testCase.current);
            expect(result.node).toEqual(testCase.node);
            expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test seq expr', () => {
    const expr = seqExpr('seq', IdExpr, NumberExpr);
    testCases([{
        text: 'id 2',
        current: 2,
        node: createSeqAST('seq', [IdNode, Num2Node]),
        errors: []
    }], ({ ctx, testCase }) => {

        test(`[${testCase.text}]`, () => {
            const result = expr(ctx);
            expect(result.current).toEqual(testCase.current);
            expect(result.node).toEqual(testCase.node);
            expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test seq expr error', () => {
    const expr = seqExpr('seq', IdExpr, NumberExpr);
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<id> expected, found <EOT>',
            '<seq> expected, found <EOT>'
        ]
    }, {
        text: '2',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<id> expected, found 2',
            '<seq> expected, found 2'
        ]
    }, {
        text: 'id',
        current: 1,
        node: DefaultASTNode,
        errors: [
            '<number> expected, found <EOT>',
            '<seq> expected, found <EOT>'
        ]
    }, {
        text: '*',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<id> expected, found *',
            '<seq> expected, found *'
        ]
    }], ({ ctx, testCase }) => {

        test(`[${testCase.text}]`, () => {
            const result = expr(ctx);
            expect(result.current).toEqual(testCase.current);
            expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test alt expr', () => {
    const expr = altExpr('alt', IdExpr, NumberExpr);
    testCases([{
        text: '2',
        current: 1,
        node: Num2Node,
        errors: []
    }, {
        text: 'id',
        current: 1,
        node: IdNode,
        errors: []
    }, {
        text: 'id 2',
        current: 1,
        node: IdNode,
        errors: []
    }, {
        text: ' 2 id',
        current: 1,
        node: Num2Node,
        errors: []
    }], ({ ctx, testCase }) => {
        test(`[${testCase.text}]`, () => {
            const result = expr(ctx);
            expect(result.current).toEqual(testCase.current);
            expect(result.node).toEqual(testCase.node);
            expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test alt expr error', () => {
    const expr = altExpr('alt', IdExpr, NumberExpr);
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: ['<alt> expected, found <EOT>']
    }, {
        text: '*',
        current: 0,
        node: DefaultASTNode,
        errors: ['<alt> expected, found *']
    }], ({ ctx, testCase }) => {
        test(`[${testCase.text}]`, () => {
            const result = expr(ctx);
            expect(result.current).toEqual(testCase.current);
            expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test repeat expr', () => {
    const expr = repeatExpr('rep', NumberExpr);
    testCases([{
        text: '',
        current: 0,
        node: createRepeatAST('rep', []),
        errors: []
    }, {
        text: '2',
        current: 1,
        node: createRepeatAST('rep', [Num2Node]),
        errors: []
    }, {
        text: 'id',
        current: 0,
        node: createRepeatAST('rep', []),
        errors: []
    }, {
        text: '*',
        current: 0,
        node: createRepeatAST('rep', []),
        errors: []
    }, {
        text: 'id 2',
        current: 0,
        node: createRepeatAST('rep', []),
        errors: []
    }, {
        text: ' 2 id',
        current: 1,
        node: createRepeatAST('rep', [Num2Node]),
        errors: []
    }, {
        text: ' 2 2 id',
        current: 2,
        node: createRepeatAST('rep', [Num2Node, Num2Node]),
        errors: []
    }], ({ ctx, testCase }) => {
        test(`[${testCase.text}]`, () => {
            const result = expr(ctx);
            expect(result.current).toEqual(testCase.current);
            expect(result.node).toEqual(testCase.node);
            expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test non terminal', () => {
    const rule = nonTermExpr('rule');

    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: ['<number> expected, found <EOT>']
    }, {
        text: '2',
        current: 1,
        node: Num2Node,
        errors: []
    }, {
        text: 'id',
        current: 0,
        node: DefaultASTNode,
        errors: ['<number> expected, found id']
    }, {
        text: '*',
        current: 0,
        node: DefaultASTNode,
        errors: ['<number> expected, found *']
    }], ({ testCase }) => {
        const ctx = buildSyntaxParserContext(testCase.text, { rule });
        test(`[${testCase.text}]`, () => {
            const result = NumberExpr(ctx);
            expect(result.current).toEqual(testCase.current);
            if (testCase.errors.length === 0) {
                expect(result.node).toEqual(testCase.node);
            }
           expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test wrong non terminal', () => {
    const rule = nonTermExpr('rule1');
    const ctx = buildSyntaxParserContext('', { rule });
    test(`[]`, () => {
        const result = rule(ctx);
        expect(result.current).toEqual(0);
   expect(result.errors).toEqual(['Rule <rule1> not found, found <EOT>']);
    });
});

describe('test symbol', () => {
    const expr = symbolExpr('*');

    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: ['* expected, found <EOT>']
    }, {
        text: '2',
        current: 0,
        node: DefaultASTNode,
        errors: ['* expected, found 2']
    }, {
        text: 'id',
        current: 0,
        node: DefaultASTNode,
        errors: ['* expected, found id']
    }, {
        text: '+',
        current: 0,
        node: DefaultASTNode,
        errors: ['* expected, found +']
    }, {
        text: '*',
        current: 1,
        node: createSymbolAST('*'),
        errors: []
    }], ({ ctx, testCase }) => {
        test(`[${testCase.text}]`, () => {
            const result = expr(ctx);
            expect(result.current).toEqual(testCase.current);
            if (testCase.errors.length === 0) {
                expect(result.node).toEqual(testCase.node);
            }
            expect(result.errors).toEqual(testCase.errors);
        });
    })
});

describe('test pow', () => {
    testCases([{
        text: '2',
        current: 1,
        node: createSeqAST('pow', [
            Num2Node,
            createRepeatAST('pow-suffix*', [
            ])
        ]),
        errors: []
    }, {
        text: 'id',
        current: 1,
        node: createSeqAST('pow', [
            IdNode,
            createRepeatAST('pow-suffix*', [
            ])
        ]),
        errors: []
    }, {
        text: '2^2',
        current: 3,
        node: createSeqAST('pow', [
            Num2Node,
            createRepeatAST('pow-suffix*', [
                createSeqAST('pow-suffix', [
                    createSymbolAST('^'),
                    Num2Node
                ])
            ])
        ]),
        errors: []
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('pow');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
                expect(result.node).toEqual(testCase.node);
            });
        }
    })
});

describe('test pow errors', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found <EOT>',
            '<pow> expected, found <EOT>'
        ]
    }, {
        text: '+',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found +',
            '<pow> expected, found +'
        ]
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('pow');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
            });
        }
    })
});

describe('test unary', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found <EOT>',
            '<pow> expected, found <EOT>',
            '<unary> expected, found <EOT>'
        ]
    }, {
        text: '2',
        current: 1,
        node: createSeqAST('unary', [
            createRepeatAST('unary-op*', []),
            createSeqAST('pow', [
                Num2Node,
                createRepeatAST('pow-suffix*', [
                ])
            ])
        ]),
        errors: []
    }, {
        text: '+',
        current: 1,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found <EOT>',
            '<pow> expected, found <EOT>',
            '<unary> expected, found <EOT>',
        ]
    }, {
        text: '+2',
        current: 2,
        node: createSeqAST('unary', [
            createRepeatAST('unary-op*', [
                createSymbolAST('+')
            ]),
            createSeqAST('pow', [
                Num2Node,
                createRepeatAST('pow-suffix*', [
                ])
            ])
        ]),
        errors: []
    }, {
        text: 'tanh exp 2',
        current: 3,
        node: createSeqAST('unary', [
            createRepeatAST('unary-op*', [
                createIdAST('tanh'),
                createIdAST('exp')
            ]),
            createSeqAST('pow', [
                Num2Node,
                createRepeatAST('pow-suffix*', [
                ])
            ])
        ]),
        errors: []
    }, {
        text: '- +2',
        current: 3,
        node: createSeqAST('unary', [
            createRepeatAST('unary-op*', [
                createSymbolAST('-'),
                createSymbolAST('+')
            ]),
            createSeqAST('pow', [
                Num2Node,
                createRepeatAST('pow-suffix*', [
                ])
            ])
        ]),
        errors: []
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('unary');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
                if (testCase.errors.length === 0) {
                    expect(result.node).toEqual(testCase.node);
                }
                });
        }
    })
});

describe('test factor', () => {
    testCases([{
        text: '2',
        current: 1,
        node: createSeqAST('factor', [
            createSeqAST('unary', [
                createRepeatAST('unary-op*', []),
                createSeqAST('pow', [
                    Num2Node,
                    createRepeatAST('pow-suffix*', [
                    ])
                ])
            ]),
            createRepeatAST('factor-suffix*', [])
        ]),
        errors: []
    }, {
        text: '2*2',
        current: 3,
        node: createSeqAST('factor', [
            createSeqAST('unary', [
                createRepeatAST('unary-op*', []),
                createSeqAST('pow', [
                    Num2Node,
                    createRepeatAST('pow-suffix*', [
                    ])
                ])
            ]),
            createRepeatAST('factor-suffix*', [
                createSeqAST('factor-suffix', [
                    createSymbolAST('*'),
                    createSeqAST('unary', [
                        createRepeatAST('unary-op*', []),
                        createSeqAST('pow', [
                            Num2Node,
                            createRepeatAST('pow-suffix*', [
                            ])
                        ])
                    ]),
                ])
            ])
        ]),
        errors: []
    }, {
        text: '2*2/2',
        current: 5,
        node: createSeqAST('factor', [
            createSeqAST('unary', [
                createRepeatAST('unary-op*', []),
                createSeqAST('pow', [
                    Num2Node,
                    createRepeatAST('pow-suffix*', [
                    ])
                ])
            ]),
            createRepeatAST('factor-suffix*', [
                createSeqAST('factor-suffix', [
                    createSymbolAST('*'),
                    createSeqAST('unary', [
                        createRepeatAST('unary-op*', []),
                        createSeqAST('pow', [
                            Num2Node,
                            createRepeatAST('pow-suffix*', [
                            ])
                        ])
                    ]),
                ]),
                createSeqAST('factor-suffix', [
                    createSymbolAST('/'),
                    createSeqAST('unary', [
                        createRepeatAST('unary-op*', []),
                        createSeqAST('pow', [
                            Num2Node,
                            createRepeatAST('pow-suffix*', [
                            ])
                        ])
                    ]),
                ])
            ])
        ]),
        errors: []
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('factor');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
                expect(result.node).toEqual(testCase.node);
            });
        }
    })
});

describe('test factor error', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found <EOT>',
            '<pow> expected, found <EOT>',
            '<unary> expected, found <EOT>',
            '<factor> expected, found <EOT>'
        ]
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('factor');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
            });
        }
    })
});

describe('test sum', () => {
    testCases([{
        text: '2',
        current: 1,
        node: createSeqAST('sum', [
            createSeqAST('factor', [
                createSeqAST('unary', [
                    createRepeatAST('unary-op*', []),
                    createSeqAST('pow', [
                        Num2Node,
                        createRepeatAST('pow-suffix*', [
                        ])
                    ])
                ]),
                createRepeatAST('factor-suffix*', [])
            ]),
            createRepeatAST('sum-suffix*', [])
        ]),
        errors: []
    }, {
        text: '2+2-2',
        current: 5,
        node: createSeqAST('sum', [
            createSeqAST('factor', [
                createSeqAST('unary', [
                    createRepeatAST('unary-op*', []),
                    createSeqAST('pow', [
                        Num2Node,
                        createRepeatAST('pow-suffix*', [])
                    ])
                ]),
                createRepeatAST('factor-suffix*', [])
            ]),
            createRepeatAST('sum-suffix*', [
                createSeqAST('sum-suffix', [
                    createSymbolAST('+'),
                    createSeqAST('factor', [
                        createSeqAST('unary', [
                            createRepeatAST('unary-op*', []),
                            createSeqAST('pow', [
                                Num2Node,
                                createRepeatAST('pow-suffix*', [])
                            ])
                        ]),
                        createRepeatAST('factor-suffix*', [])
                    ])
                ]),
                createSeqAST('sum-suffix', [
                    createSymbolAST('-'),
                    createSeqAST('factor', [
                        createSeqAST('unary', [
                            createRepeatAST('unary-op*', []),
                            createSeqAST('pow', [
                                Num2Node,
                                createRepeatAST('pow-suffix*', [])
                            ])
                        ]),
                        createRepeatAST('factor-suffix*', [])
                    ])
                ])
            ])
        ]),
        errors: []
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('sum');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
                expect(result.node).toEqual(testCase.node);
            });
        }
    })
});

describe('test sum error', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found <EOT>',
            '<pow> expected, found <EOT>',
            '<unary> expected, found <EOT>',
            '<factor> expected, found <EOT>',
            '<sum> expected, found <EOT>'
        ]
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('sum');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
            });
        }
    })
});

describe('test expr', () => {
    testCases([{
        text: '2',
        current: 1,
        node: createSeqAST('expr', [
            createSeqAST('sum', [
                createSeqAST('factor', [
                    createSeqAST('unary', [
                        createRepeatAST('unary-op*', []),
                        createSeqAST('pow', [
                            Num2Node,
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
        errors: []
    }, {
        text: '2,2',
        current: 3,
        node: createSeqAST('expr', [
            createSeqAST('sum', [
                createSeqAST('factor', [
                    createSeqAST('unary', [
                        createRepeatAST('unary-op*', []),
                        createSeqAST('pow', [
                            Num2Node,
                            createRepeatAST('pow-suffix*', [
                            ])
                        ])
                    ]),
                    createRepeatAST('factor-suffix*', [])
                ]),
                createRepeatAST('sum-suffix*', [])
            ]),
            createRepeatAST('expr-suffix*', [
                createSeqAST('expr-suffix', [
                    createSymbolAST(','),
                    createSeqAST('sum', [
                        createSeqAST('factor', [
                            createSeqAST('unary', [
                                createRepeatAST('unary-op*', []),
                                createSeqAST('pow', [
                                    Num2Node,
                                    createRepeatAST('pow-suffix*', [
                                    ])
                                ])
                            ]),
                            createRepeatAST('factor-suffix*', [])
                        ]),
                        createRepeatAST('sum-suffix*', [])
                    ])
                ]),
            ])
        ]),
        errors: []
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('expr');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
                expect(result.node).toEqual(testCase.node);
            });
        }
    })
});

describe('test expr error', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found <EOT>',
            '<pow> expected, found <EOT>',
            '<unary> expected, found <EOT>',
            '<factor> expected, found <EOT>',
            '<sum> expected, found <EOT>',
            '<expr> expected, found <EOT>'
        ]
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('expr');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
            });
        }
    })
});

describe('test bracket', () => {
    testCases([{
        text: '( 2 )',
        current: 3,
        node: createSeqAST('bracket', [
            createSymbolAST('('),
            createSeqAST('expr', [
                createSeqAST('sum', [
                    createSeqAST('factor', [
                        createSeqAST('unary', [
                            createRepeatAST('unary-op*', []),
                            createSeqAST('pow', [
                                Num2Node,
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
            createSymbolAST(')'),
        ]),
        errors: []
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('bracket');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
                expect(result.node).toEqual(testCase.node);
            });
        }
    })
});

describe('test bracket error', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '( expected, found <EOT>',
            '<bracket> expected, found <EOT>'
        ]
    }, {
        text: '{',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '( expected, found {',
            '<bracket> expected, found {'
        ]
    }, {
        text: '(',
        current: 1,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found <EOT>',
            '<pow> expected, found <EOT>',
            '<unary> expected, found <EOT>',
            '<factor> expected, found <EOT>',
            '<sum> expected, found <EOT>',
            '<expr> expected, found <EOT>',
            '<bracket> expected, found <EOT>'
        ]
    }, {
        text: '( 2',
        current: 2,
        node: DefaultASTNode,
        errors: [
            ') expected, found <EOT>',
            '<bracket> expected, found <EOT>'
        ]
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('bracket');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
            });
        }
    })
});

describe('test expression', () => {
    testCases([{
        text: '2',
        current: 1,
        node: createSeqAST('expression', [
            createSeqAST('expr', [
                createSeqAST('sum', [
                    createSeqAST('factor', [
                        createSeqAST('unary', [
                            createRepeatAST('unary-op*', []),
                            createSeqAST('pow', [
                                Num2Node,
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
        ]),
        errors: []
    }, {
        text: '2,2',
        current: 3,
        node: createSeqAST('expression', [
            createSeqAST('expr', [
                createSeqAST('sum', [
                    createSeqAST('factor', [
                        createSeqAST('unary', [
                            createRepeatAST('unary-op*', []),
                            createSeqAST('pow', [
                                Num2Node,
                                createRepeatAST('pow-suffix*', [
                                ])
                            ])
                        ]),
                        createRepeatAST('factor-suffix*', [])
                    ]),
                    createRepeatAST('sum-suffix*', [])
                ]),
                createRepeatAST('expr-suffix*', [
                    createSeqAST('expr-suffix', [
                        createSymbolAST(','),
                        createSeqAST('sum', [
                            createSeqAST('factor', [
                                createSeqAST('unary', [
                                    createRepeatAST('unary-op*', []),
                                    createSeqAST('pow', [
                                        Num2Node,
                                        createRepeatAST('pow-suffix*', [
                                        ])
                                    ])
                                ]),
                                createRepeatAST('factor-suffix*', [])
                            ]),
                            createRepeatAST('sum-suffix*', [])
                        ])
                    ]),
                ])
            ]),
            endAST
        ]),
        errors: []
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('expression');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
                expect(result.node).toEqual(testCase.node);
            });
        }
    })
});


describe('test expression error', () => {
    testCases([{
        text: '',
        current: 0,
        node: DefaultASTNode,
        errors: [
            '<terminal> expected, found <EOT>',
            '<pow> expected, found <EOT>',
            '<unary> expected, found <EOT>',
            '<factor> expected, found <EOT>',
            '<sum> expected, found <EOT>',
            '<expr> expected, found <EOT>',
            '<expression> expected, found <EOT>'
        ]
    }, {
        text: '2 2',
        current: 1,
        node: DefaultASTNode,
        errors: [
            '<EOF> expected, found 2',
            '<expression> expected, found 2'
        ]
    }], ({ ctx, testCase }) => {
        const expr = ctx.rule('expression');
        if (expr) {
            test(`[${testCase.text}]`, () => {
                const result = expr(ctx);
                expect(result.errors).toEqual(testCase.errors);
                expect(result.current).toEqual(testCase.current);
            });
        }
    })
});
