import * as BABYLON from 'babylonjs'

/*
 * Returns the Color3 for HSB value (Hue, Saturation, Bright)
 */
export function fromHSB(h: number, s: number, b: number) {
  var hc = null;
  if (h <= 0) {
    hc = BABYLON.Color3.Red();
  } else if (h < 1 / 6) {
    hc = new BABYLON.Color3(1, h * 6, 0);
  } else if (h < 2 / 6) {
    hc = new BABYLON.Color3(2 - 6 * h, 1, 0);
  } else if (h < 3 / 6) {
    hc = new BABYLON.Color3(0, 1, h * 6 - 2);
  } else if (h < 4 / 6) {
    hc = new BABYLON.Color3(0, 4 - h * 6, 1);
  } else if (h < 5 / 6) {
    hc = new BABYLON.Color3(h * 6 - 4, 0, 1);
  } else if (h < 1) {
    hc = new BABYLON.Color3(1, 0, 6 - h * 6);
  } else {
    hc = BABYLON.Color3.Red();
  }
  const sc = BABYLON.Color3.White().scale(1 - s).add(hc.scale(s));
  return sc.scale(b);
}

/*
 * Returns the Color3 of heat color scale (Violet to Red)
 */
export function fromHeat(h: number) {
  return fromHSB((1 - h) * 5 / 6, 1, 1 - (1 - h) * 0.2);
}
