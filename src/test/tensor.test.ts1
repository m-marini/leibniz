import { matrix } from "../modules/leibniz-tensor";

describe("Matrix [[1,2],[3,4]]", function () {
  const mtx = matrix([[1, 2], [3, 4]]);
  it("contains values [[1,2],[3,4]]", function () {
    expect(mtx.get(0, 0)).toBe(1);
    expect(mtx.get(0, 1)).toBe(2);
    expect(mtx.get(1, 0)).toBe(3);
    expect(mtx.get(1, 1)).toBe(4);
    const inv = mtx.inverse();
  });
});

describe("inverse matrix [[1,2],[3,4]]", function () {
  const mtx = matrix([[1, 2], [3, 4]]).inverse();
  it("contains values [[-2,1],[1.5,-0.5]]", function () {
    expect(mtx.get(0, 0)).toBeCloseTo(-2);
    expect(mtx.get(0, 1)).toBeCloseTo(1);
    expect(mtx.get(1, 0)).toBeCloseTo(1.5);
    expect(mtx.get(1, 1)).toBeCloseTo(-0.5);
  });
});

describe("matrix [[1,2],[3,4]] by inverse matrix [[1,2],[3,4]]", function () {
  const a = matrix([[1, 2], [3, 4]]);
  const b = a.inverse();
  const mtx = a.multiply(b);

  it("contains values [[1,0],[0,1]]", function () {
    expect(mtx.get(0, 0)).toBeCloseTo(1);
    expect(mtx.get(0, 1)).toBeCloseTo(0);
    expect(mtx.get(1, 0)).toBeCloseTo(0);
    expect(mtx.get(1, 1)).toBeCloseTo(1);
  });
});
