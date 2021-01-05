import _ from 'lodash';
import { BodyStatus, BodyStructure, CurrentSysDefVersion, InternalStatus, SystemDefinition, SystemErrors } from '../modules/leibniz-defs';
import { parse } from '../modules/leibniz-parser';
import {
    undefinedDependencyErrors, closure, dependencies, extractDependencies,
    parseSystemDefs, transitionErrors, circularErrors, funcStatusErrors,
    orderedDependencies, statusCodeGen, bodiesCodeGen, transitionCodeGen, mapBodiesPR, compile
} from "../modules/leibniz-compiler";
import { DefaultQuaternionCode, DefaultScalarCode, matrix0Code, numberCode, ValueCode, ValueTypeCode, vector0Code } from '../modules/leibnitz-codegen';
import { Quaternion, Vector3 } from 'babylonjs';
import { AnyValue, matrix, vector } from '../modules/leibniz-tensor';

function flattenErrors(errors: SystemErrors): string[] {
    return _.concat(
        _(errors.bodies).flatMap(b =>
            _.concat(b.position, b.rotation ?? [])
        ).value(),
        _(errors.funcs).values().flatten().value(),
        _(errors.initialStatus).values().flatten().value(),
        _(errors.transition).values().flatten().value());
}

describe('test extractDependencies', () => {
    [{
        text: '1',
        dependencies: []
    }, {
        text: 'a',
        dependencies: ['a']
    }, {
        text: 'a*(b+c)',
        dependencies: ['a', 'b', 'c']
    }, {
        text: 'e*(b+c)',
        dependencies: ['b', 'c']
    }, {
        text: 'exp(b+c)',
        dependencies: ['b', 'c']
    }, {
        text: 'sin(b+c)',
        dependencies: ['b', 'c']
    }].forEach(({ text, dependencies }) => {
        const parsed = parse(text);
        test(`[${text}]`, () => {

            expect(parsed.errors).toEqual([]);

            const result = extractDependencies(parsed.ast);

            expect(result).toEqual(dependencies);
        });
    })
});

describe('test closure', () => {
    test(`test 1`, () => {
        const deps = {
            a: [],
            b: ['a'],
            c: ['b'],
            d: ['f'],
            e: ['d'],
            f: ['e']
        }
        const result = closure(deps);
        expect(result).toEqual({
            a: [],
            b: ['a'],
            c: ['a', 'b'],
            d: ['d', 'e', 'f'],
            e: ['d', 'e', 'f'],
            f: ['d', 'e', 'f']
        });
    });
});

describe('check for undefined dependencies', () => {
    const cases: {
        system: SystemDefinition;
        errors: SystemErrors;
    }[] = [{
        system: {
            version: CurrentSysDefVersion,
            // undefined c on body
            bodies: [
                {
                    position: 'c'
                },
                {
                    position: 'a+c',
                    rotation: '3+a+c'
                }
            ],
            // undefined d on a
            funcs: {
                a: 'd'
            },
            // undefined f on b
            initialStatus: {
                b: 'a+f'
            },
            // undefined g on b
            transition: {
                b: 'b+g'
            }
        },
        errors: {
            bodies: [{
                position: ['c is not defined']
            }, {
                position: ['c is not defined'],
                rotation: ['c is not defined']
            }],
            funcs: {
                a: ['d is not defined']
            },
            initialStatus: {
                b: ['f is not defined']
            },
            transition: {
                b: ['g is not defined']
            }
        }
    }];
    cases.forEach(({ system, errors }, i) => {
        test(`test ${i}`, () => {
            const parsed = parseSystemDefs(system);
            const deps = dependencies(parsed);
            const result = undefinedDependencyErrors(deps);
            expect(result).toEqual(errors);
        });
    })
});

describe('check for transition error', () => {
    const cases: {
        system: SystemDefinition;
        errors: Record<string, string[]>;
    }[] = [{
        system: {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {},
            // undefined f on b
            initialStatus: {
                a: '1',
                b: '1'
            },
            transition: { b: 'b+a' }
        },
        errors: { b: [] }
    }, {
        system: {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {},
            initialStatus: {
                a: '1',
                b: '1'
            },
            transition: {
                a: 'b+a',
                b: 'b+a'
            }
        },
        errors: { a: [], b: [] }
    }, {
        system: {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {},
            initialStatus: {
                a: '1',
            },
            transition: {
                a: 'a+b',
                b: 'a+b'
            }
        },
        errors: { a: [], b: ['b is not an initial status'] }
    }];
    cases.forEach(({ system, errors }, i) => {
        test(`test ${i}`, () => {
            const parsed = parseSystemDefs(system);
            const result = transitionErrors(parsed);
            expect(result).toEqual(errors);
        });
    })
});

describe('check for circular error', () => {
    [{
        name: 'funcs circular',
        system: {
            bodies: [] as BodyStructure<string>[],
            funcs: {
                a: 'b',
                b: 'a'
            },
            initialStatus: {},
            transition: {}
        },
        errors: {
            bodies: [] as BodyStructure<string>[],
            funcs: {
                a: ['a is a circular reference'],
                b: ['b is a circular reference']
            },
            initialStatus: {},
            transition: {}
        }
    }, {
        name: 'initial circular',
        system: {
            bodies: [] as BodyStructure<string>[],
            funcs: {} as Record<string, string>,
            initialStatus: {
                a: 'b',
                b: 'a'
            } as Record<string, string>,
            transition: {} as Record<string, string>
        },
        errors: {
            bodies: [],
            funcs: {},
            initialStatus: {
                a: ['a is a circular reference'],
                b: ['b is a circular reference']
            },
            transition: {}
        }
    }, {
        name: 'funcs, initial circular',
        system: {
            bodies: [] as BodyStructure<string>[],
            funcs: {
                a: 'b'
            } as Record<string, string>,
            initialStatus: {
                b: 'a'
            } as Record<string, string>,
            transition: {} as Record<string, string>
        },
        errors: {
            bodies: [],
            funcs: {
                a: ['a is a circular reference']
            },
            initialStatus: {
                b: ['b is a circular reference']
            },
            transition: {}
        }
    }].forEach(({ name, system, errors }, i) => {
        test(name, () => {
            const parsed = parseSystemDefs(system as SystemDefinition);
            const deps = dependencies(parsed);
            const result = circularErrors(deps);
            expect(result).toEqual(errors);
        });
    })
});

describe('check for function definition', () => {
    [{
        system: {
            version: CurrentSysDefVersion,
            bodies: [] as BodyStructure<string>[],
            funcs: {
                a: 'b',
                b: 'a'
            },
            initialStatus: {
                a: '1'
            },
            transition: {}
        },
        errors: {
            a: ['a is a status variable'],
        }
    }].forEach(({ system, errors }, i) => {
        test(`test ${i}`, () => {
            const parsed = parseSystemDefs(system as SystemDefinition);
            const deps = dependencies(parsed);
            const result = funcStatusErrors(deps);
            expect(result).toEqual(errors);
        });
    })
});

describe('check for ordered dependencies', () => {
    test(`
given
  a---b---c---d
      |
  h---e---f
      |
      +---g

  i---j
when sorting
then result d c f g e b a h i j 
`, () => {
        const deps = {
            a: ['b'],
            b: ['c', 'e'],
            c: ['d'],
            e: ['f', 'g'],
            h: ['e'],
            i: ['j']
        };
        const result = orderedDependencies(deps);
        expect(result).toEqual([
            'd', 'c', 'f', 'g', 'e', 'b', 'a', 'h', 'j', 'i'
        ]);
    });
});

describe('statusCodeGen', () => {
    test(`correct`, () => {
        const sys: SystemDefinition = {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {
                a: '1',
                b: 'a+1',
            },
            initialStatus: {
                s0: 'a+b',
                s1: 'i+a',
                s2: 'a,b',
                s3: 's2,(3,4)'
            },
            transition: {}
        };
        const parsed = parseSystemDefs(sys);
        expect(flattenErrors(parsed.errors)).toEqual([]);

        const { errors, table } = statusCodeGen(parsed);
        expect(flattenErrors(errors)).toEqual([]);

        expect(table).toMatchObject({
            s0: { type: ValueTypeCode.Scalar },
            s1: { type: ValueTypeCode.Quaternion },
            s2: { type: ValueTypeCode.Vector, rows: 2 },
            s3: { type: ValueTypeCode.Matrix, rows: 2, cols: 2 },
        })

        const ctx: Record<string, AnyValue> = {};
        const status = _(table).mapValues(v => v.code(ctx)).value();

        expect(status).toEqual({
            s0: 3,
            s1: new Quaternion(1, 0, 0, 1),
            s2: vector(1, 2),
            s3: matrix([
                [1, 3],
                [2, 4]
            ])
        });
    });
    test(`missing def`, () => {
        const sys: SystemDefinition = {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {
                a: '1',
                c: 'd'
            },
            initialStatus: {
                s0: 'a+b',
                s1: 'i+a+d',
                s2: 'a,b,d',
                s3: 's2,(3,4)'
            },
            transition: {}
        };
        const parsed = parseSystemDefs(sys);
        expect(flattenErrors(parsed.errors)).toEqual([]);

        const { errors, table } = statusCodeGen(parsed);
        expect(errors).toMatchObject({
            funcs: {
                c: ['"d" is not defined'],
            },
            initialStatus: {
                s0: ['"b" is not defined'],
                s1: ['"d" is not defined'],
                s2: ['"b" is not defined', '"d" is not defined'],
                s3: []
            }
        })

        expect(table).toMatchObject({
            s0: { type: ValueTypeCode.Scalar },
            s1: { type: ValueTypeCode.Quaternion },
            s2: { type: ValueTypeCode.Vector, rows: 3 },
            s3: { type: ValueTypeCode.Matrix, rows: 3, cols: 2 },
        })

        const ctx: Record<string, AnyValue> = {};
        const status = _(table).mapValues(v => v.code(ctx)).value();

        expect(status).toEqual({
            s0: 1,
            s1: new Quaternion(1, 0, 0, 1),
            s2: vector(1, 0, 0),
            s3: matrix([
                [1, 3],
                [0, 4],
                [0, 0]
            ])
        });
    });

    test(`cycle def`, () => {
        const sys: SystemDefinition = {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {
                a: 's0',
            },
            initialStatus: {
                s0: 'a+i',
                s1: '1'
            },
            transition: {}
        };
        const parsed = parseSystemDefs(sys);
        expect(flattenErrors(parsed.errors)).toEqual([]);

        const { errors, table } = statusCodeGen(parsed);
        expect(errors).toMatchObject({
            funcs: {
                a: ['"a" is a cycle reference'],
            },
            initialStatus: {
                s0: ['"s0" is a cycle reference'],
                s1: []
            }
        })

        expect(table).toMatchObject({
            s0: { type: ValueTypeCode.Scalar },
            s1: { type: ValueTypeCode.Scalar }
        })

        const ctx: Record<string, AnyValue> = {};
        const status = _(table).mapValues(v => v.code(ctx)).value();

        expect(status).toEqual({
            s0: 0,
            s1: 1,
        });
    });
});

describe('bodiesCodeGen', () => {
    test(`correct`, () => {
        const sys: SystemDefinition = {
            version: CurrentSysDefVersion,
            bodies: [{
                position: 'a',
                rotation: 'qrot(ex*PI/3)'
            }, {
                position: '2*a',
            }],
            funcs: {
                a: 'b,0,0'
            },
            initialStatus: {},
            transition: {}
        };
        const parsed = parseSystemDefs(sys);
        expect(flattenErrors(parsed.errors)).toEqual([]);

        const init: Record<string, ValueCode> = {
            b: numberCode(1)
        }
        const { errors, code } = bodiesCodeGen(parsed, init);
        expect(flattenErrors(errors)).toEqual([]);

        expect(code).toMatchObject([{
            position: { type: ValueTypeCode.Vector, rows: 3 },
            rotation: { type: ValueTypeCode.Quaternion }
        }, {
            position: { type: ValueTypeCode.Vector, rows: 3 },
            rotation: undefined
        }]);

        const ctx: Record<string, AnyValue> = { b: 1 };

        const bodiesStatus = mapBodiesPR(code,
            node => node.code(ctx),
            node => node.code(ctx));

        expect(bodiesStatus).toEqual([{
            position: vector(1, 0, 0),
            rotation: Quaternion.RotationAxis(new Vector3(1, 0, 0), Math.PI / 3)
        }, {
            position: vector(2, 0, 0),
            rotation: undefined
        }])

    });

    test(`missing def`, () => {
        const sys: SystemDefinition = {
            version: CurrentSysDefVersion,
            bodies: [{
                position: 'b',
                rotation: 'b'
            }, {
                position: '2*a',
            }],
            funcs: {
                a: '0,0,0'
            },
            initialStatus: {},
            transition: {}
        };
        const parsed = parseSystemDefs(sys);
        expect(flattenErrors(parsed.errors)).toEqual([]);

        const init: Record<string, ValueCode> = {};
        const { errors, code } = bodiesCodeGen(parsed, init);
        expect(errors).toMatchObject({
            bodies: [{
                position: [
                    '"b" is not defined',
                    'vector3 expected, scalar found'
                ],
                rotation: [
                    '"b" is not defined',
                    'quaternion expected, scalar found'
                ]
            }, {
                position: [],
                rotation: undefined
            }]
        });

        expect(code).toMatchObject([{
            position: { type: ValueTypeCode.Vector, rows: 3 },
            rotation: { type: ValueTypeCode.Quaternion }
        }, {
            position: { type: ValueTypeCode.Vector, rows: 3 },
            rotation: undefined
        }]);

        const ctx: Record<string, AnyValue> = { b: 1 };

        const bodiesStatus = mapBodiesPR(code,
            node => node.code(ctx),
            node => node.code(ctx));

        expect(bodiesStatus).toEqual([{
            position: vector(0, 0, 0),
            rotation: Quaternion.Identity()
        }, {
            position: vector(0, 0, 0),
            rotation: undefined
        }])
    });
});

describe('transictionCodeGen', () => {
    test(`correct`, () => {
        const sys: SystemDefinition = {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {
                a: 'b+1'
            },
            initialStatus: {},
            transition: {
                b: `a`
            }
        };
        const parsed = parseSystemDefs(sys);
        expect(flattenErrors(parsed.errors)).toEqual([]);

        const init: Record<string, ValueCode> = {
            b: numberCode(1)
        }
        const { errors, code } = transitionCodeGen(parsed, init);
        expect(flattenErrors(errors)).toEqual([]);

        expect(code).toMatchObject({
            b: { type: ValueTypeCode.Scalar }
        });

        const ctx: Record<string, AnyValue> = { b: 1 };

        const transitions = _.mapValues(code, node => node.code(ctx));

        expect(transitions).toEqual({
            b: 2
        });
    });

    test(`errors`, () => {
        const sys: SystemDefinition = {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {},
            initialStatus: {},
            transition: {
                a: 'i',
                b: 'x+1',
                c: '1',
                d: '1',
                e: '1'
            }
        };
        const parsed = parseSystemDefs(sys);
        expect(flattenErrors(parsed.errors)).toEqual([]);

        const init: Record<string, ValueCode> = {
            b: DefaultScalarCode,
            c: DefaultQuaternionCode,
            d: vector0Code(3),
            e: matrix0Code(2, 2)
        };
        const { errors, code } = transitionCodeGen(parsed, init);
        expect(errors).toMatchObject({
            transition: {
                a: ['"a" is not a status variable'],
                b: ['"x" is not defined'],
                c: ['quaternion expected, scalar found'],
                d: ['vector3 expected, scalar found'],
                e: ['matrix2x2 expected, scalar found']
            }
        });

        expect(code).toMatchObject({
            b: { type: ValueTypeCode.Scalar },
        });

        const ctx: Record<string, AnyValue> = { a: 1, b: 2 };
        const status = _.mapValues(code, node => node.code(ctx));
        expect(status).toEqual({
            b: 1,
            c: Quaternion.Identity(),
            d: vector(0, 0, 0),
            e: matrix([[0, 0], [0, 0]])
        });
    });
});

describe('compiler correct', () => {
    const dt = 0.1;
    const data: {
        name: string,
        sys: SystemDefinition,
        sequence: {
            internalStatus: InternalStatus;
            bodies: BodyStatus[];
        }[]
    }[] = [{
        name: 'base',
        sys: {
            version: CurrentSysDefVersion,
            bodies: [{
                position: 't*v',
                rotation: 'qrot(t*w)'
            }],
            funcs: {
                v: '2*ex',
                w: 'ez*PI/2*10'
            },
            initialStatus: { t: '0' },
            transition: { t: 't+dt' }
        },
        sequence: [{
            internalStatus: { t: 0 },
            bodies: [{
                position: vector(0, 0, 0),
                rotation: Quaternion.Identity()
            }]
        }, {
            internalStatus: { t: 0.1 },
            bodies: [{
                position: vector(0.2, 0, 0),
                rotation: Quaternion.RotationAxis(new Vector3(0, 0, 1), Math.PI / 2)
            }]
        }]
    }, {
        name: 'qrot',
        sys: {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: {
                axis: "ez",
                drot: "qrot(axis * rps * 2 * PI * dt)",
                rps: "1"
            },
            initialStatus: { s: 'drot' },
            transition: {}
        },
        sequence: [{
            internalStatus: { s: Quaternion.RotationAxis(new Vector3(0, 0, 1), 0) },
            bodies: []
        }]
    }];
    data.forEach(({ name, sys, sequence }) => {
        test(name, () => {
            const { rules, errors } = compile(sys);
            expect(flattenErrors(errors)).toEqual([]);
            var status = rules.initialStatus();
            sequence.forEach(({ internalStatus, bodies }) => {
                const result = rules.bodies(status);
                expect(status).toEqual(internalStatus);
                expect(result).toEqual(bodies);
                status = rules.next(status, dt);
            });
        });
    });
});


describe('compiler errors', () => {
    const data: {
        name: string;
        sys: SystemDefinition;
        errors: SystemErrors;
    }[] = [{
        name: 'undefined',
        sys: {
            version: CurrentSysDefVersion,
            bodies: [{
                position: 'u0',
                rotation: 'u1'
            }],
            funcs: {
                a: 'ua',
                b: 'ub'
            },
            initialStatus: {
                c: 'uc',
                d: 'ud',
            },
            transition: {
                c: 'ue',
                d: 'uf'
            }
        } as SystemDefinition,
        errors: {
            bodies: [{
                position: ['"u0" is not defined', 'vector3 expected, scalar found'],
                rotation: ['"u1" is not defined', 'quaternion expected, scalar found']
            }],
            funcs: {
                a: ['"ua" is not defined'],
                b: ['"ub" is not defined']
            },
            initialStatus: {
                c: ['"uc" is not defined'],
                d: ['"ud" is not defined']
            },
            transition: {
                c: ['"ue" is not defined'],
                d: ['"uf" is not defined']
            }
        }
    }, {
        name: 'cycled',
        sys: {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: { a: 'b' },
            initialStatus: { b: 'a' },
            transition: {}
        },
        errors: {
            bodies: [],
            funcs: { a: ['"a" is a cycle reference'], },
            initialStatus: { b: ['"b" is a cycle reference'], },
            transition: {}
        }
    }, {
        name: 'wrong types',
        sys: {
            version: CurrentSysDefVersion,
            bodies: [{
                position: '1',
                rotation: '1',
            }],
            funcs: {},
            initialStatus: { a: '1', },
            transition: { a: 'i', b: '1' }
        },
        errors: {
            bodies: [{
                position: ['vector3 expected, scalar found'],
                rotation: ['quaternion expected, scalar found']
            }],
            funcs: {},
            initialStatus: { a: [] },
            transition: {
                a: ['scalar expected, quaternion found'],
                b: ['"b" is not a status variable']
            }
        }
    }, {
        name: 'wrong syntax',
        sys: {
            version: CurrentSysDefVersion,
            bodies: [],
            funcs: { a: '1+ex+I2' },
            initialStatus: {},
            transition: {}
        },
        errors: {
            bodies: [],
            funcs: {
                a: ['scalar or quaternion expected, vector3 found',
                    'vector expected, matrix2x2 found']
            },
            initialStatus: {},
            transition: {}
        }
    }];
    data.forEach(({ name, sys, errors: expErrors }) => {
        test(name, () => {
            const { errors } = compile(sys);
            expect(errors).toEqual(expErrors);
        });
    });
});
