import { createIdAST, createNumberAST, createRepeatAST, createSeqAST, createSymbolAST, DefaultASTNode, endAST, parse } from "../modules/leibniz-parser";
import _ from 'lodash';

describe('test parse errors', () => {
    [{
        text: '',
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
        text: '$',
        errors: [
            '<terminal> expected, found $',
            '<pow> expected, found $',
            '<unary> expected, found $',
            '<factor> expected, found $',
            '<sum> expected, found $',
            '<expr> expected, found $',
            '<expression> expected, found $'
        ]
    }, {
        text: '2^',
        errors: [
            '<EOF> expected, found ^',
            '<expression> expected, found ^'
        ]
    }].forEach(({ text, errors }) => {
        test(`[${text}]`, () => {
            const result = parse(text);
            expect(result.errors).toEqual(errors);
            expect(result.ast).toEqual(DefaultASTNode);
        });
    })
});

describe('test parse', () => {
    [{
        text: 'qrot(ez)',
        node: createSeqAST('expression', [
            createSeqAST('expr', [
                createSeqAST('sum', [
                    createSeqAST('factor', [
                        createSeqAST('unary', [
                            createRepeatAST('unary-op*', [
                                createIdAST('qrot')
                            ]),
                            createSeqAST('pow', [
                                createSeqAST('bracket', [
                                    createSymbolAST('('),
                                    createSeqAST('expr', [
                                        createSeqAST('sum', [
                                            createSeqAST('factor', [
                                                createSeqAST('unary', [
                                                    createRepeatAST('unary-op*', []),
                                                    createSeqAST('pow', [
                                                        createIdAST('ez'),
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
                                    createSymbolAST(')')
                                ]),
                                createRepeatAST('pow-suffix*', [])
                            ])
                        ]),
                        createRepeatAST('factor-suffix*', [])
                    ]),
                    createRepeatAST('sum-suffix*', [])
                ]),
                createRepeatAST('expr-suffix*', [])
            ]),
            endAST
        ])
    }].forEach(({ text, node }) => {
        test(`[${text}]`, () => {
            const result = parse(text);
            expect(result.errors).toEqual([]);
            expect(result.ast).toEqual(node);
        });
    })
});
