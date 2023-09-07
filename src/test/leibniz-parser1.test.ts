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
