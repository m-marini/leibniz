'use strict';

import * as BABYLON from 'babylonjs';
import 'lodash';
import 'jquery'
import * as hsb from './hsb-color-1.1.0';
import { createTestSystem } from './leibniz-equ-0.2.1';

const Octahedron = 1
const ElongatedSquareDipyramid = 12

function createCamera(scene, options) {
    var camera = null;
    switch (options.cameraType) {
        case 'do':
            camera = new BABYLON.DeviceOrientationCamera('DevOr_camera', new BABYLON.Vector3(0, 0, 0), scene);
            camera.position = options.cameraPosition;
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.angularSensibility = 10;
            camera.moveSensibility = 10;
            break;
        case 'ac':
            camera = new BABYLON.AnaglyphArcRotateCamera('aar_cam', -Math.PI / 2, Math.PI / 4, 20, new BABYLON.Vector3.Zero(), 0.033, scene);
            return camera;
            camera.target = BABYLON.Vector3.Zero();
            camera.setPosition(options.cameraPosition);
            break;
        case 'vr':
            camera = new BABYLON.VRDeviceOrientationArcRotateCamera('Camera', Math.PI / 2, Math.PI / 4, 25, new BABYLON.Vector3(0, 0, 0), scene);
            camera.target = BABYLON.Vector3.Zero();
            camera.setPosition(options.cameraPosition);
            break;
        default:
            camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
            camera.target = BABYLON.Vector3.Zero();
            camera.setPosition(options.cameraPosition);
            break;
    }
    camera.minZ = options.cameraMinZ;
    return camera;
}

class Leibniz {
    constructor(options) {
        this._options = _.defaults(options, {
            cameraPosition: new BABYLON.Vector3(0, 0, -5),
            cameraMinZ: 0.5,
            ambientColor: new BABYLON.Color3(0.2, 0.2, 0.2),
            sunLightDirection: new BABYLON.Vector3(1, 1, -1),
            sunLightIntensity: 0.7,
        });

    }

    createOcta(name, color) {
        const shape = BABYLON.MeshBuilder.CreatePolyhedron(
            'Octa_' + name, {
                type: Octahedron,
                sizeX: 0.1,
                sizeY: 0.2,
                sizeZ: 0.05,
            },
            self._scene
        );
        shape.material = new BABYLON.StandardMaterial('Material_' + name, this._scene);
        shape.material.ambientColor = color;
        shape.material.diffuseColor = color;
        return shape;
    }

    createSphere(name, color) {
        const sphere = BABYLON.MeshBuilder.CreateIcoSphere(
            'Sphere_' + name, {
                flat: 0,
                radius: 0.1,
                subdivisions: 4,
                updatable: false
            },
            self._scene);
        sphere.material = new BABYLON.StandardMaterial('Material_' + name, self._scene);
        sphere.material.ambientColor = color;
        sphere.material.diffuseColor = color;
        return sphere;
    }

    init(elementId) {
        this._canvas = document.getElementById(elementId);
        this._engine = new BABYLON.Engine(this._canvas, true, {
            deterministicLockstep: true,
            lockstepMaxSteps: 4
        });
        this._scene = new BABYLON.Scene(this._engine);
        const camera = createCamera(this._scene, this._options);
        camera.attachControl(this._canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight(
            'sunLight',
            this._options.sunLightDirection,
            this._scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = this._options.sunLightIntensity;

        this._scene.ambientColor = this._options.ambientColor;
        this._state = createTestSystem();

        this._shapes = _.map(this._state.bodies, (body, i, ary) => {
            const name = 'Body' + i;
            const color = hsb.fromHeat(ary.length > 1 ? i / (ary.length - 1) : 0);
            const shape = (body.rotation !== undefined)
                ? this.createOcta(name, color)
                : this.createSphere(name, color);
            updateShape(shape, body)
            return shape;
        });

        $(window).on('resize', this._engine.resize);

        this._scene.onBeforeStepObservable.add((scene) => {
            const ar = scene.getAnimationRatio() || 1;
            const dt = ar / 60;
            this._state = this._state.next(dt);
        });

        function updateShape(shape, body) {
            const pos = new BABYLON.Vector3(
                body.position.values[0][0].w,
                body.position.values[1][0].w,
                body.position.values[2][0].w);
            shape.position = pos;
            if (body.rotation) {
                const rot = new BABYLON.Quaternion.FromArray(body.rotation.values);
                shape.rotationQuaternion = rot;
            }
        }

        // Adds callback handler on rendering loop
        this._engine.runRenderLoop(() => {
            _.each(_.zip(this._state.bodies, this._shapes), (ary) =>
                updateShape(ary[1], ary[0])
            );
            this._scene.render();
        });
    }
}

export { Leibniz };
