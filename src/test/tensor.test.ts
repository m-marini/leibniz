import { Matrix, compile, matrix } from "mathjs";

it("Matrix [[1,2],[3,4]]", () => {
    const f = compile("a=[[[1]]]");
    const scope: any = {};
    f.evaluate(scope);
    expect((scope.a as Matrix).get([0, 0, 0])).toBe(1);
});

it("Matrix [[[1]]]]", () => {
    const a = matrix([1]).resize([1, 1, 1]);
    expect(a.get([0, 0, 0])).toBe(1);
});

it("Matrix [[[1,2],[3,4]],[[5,6],[7,8]]]", () => {
    const a = matrix([1,2,3,4,5,6,7,8]).resize([2, 2, 2]);
    console.log('a', a);
    expect(a.get([0, 0, 0])).toBe(1);
    expect(a.get([1, 0, 0])).toBe(2);
    expect(a.get([0, 1, 0])).toBe(3);
});
