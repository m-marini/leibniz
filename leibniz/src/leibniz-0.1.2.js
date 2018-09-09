import * as BABYLON from 'babylonjs';
import { default as _ } from 'lodash';
import * as hsb from './hsb-color-1.1.0';

const Octahedron = 1;
const ElongatedSquareDipyramid = 12;

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

function createOcta(scene, name, color) {
    const shape = BABYLON.MeshBuilder.CreatePolyhedron(
        'Octa_' + name, {
            type: Octahedron,
            sizeX: 0.1,
            sizeY: 0.2,
            sizeZ: 0.05,
        },
        scene
    );
    shape.material = new BABYLON.StandardMaterial('Material_' + name, scene);
    shape.material.ambientColor = color;
    shape.material.diffuseColor = color;
    return shape;
}

function createSphere(scene, name, color) {
    const sphere = BABYLON.MeshBuilder.CreateIcoSphere(
        'Sphere_' + name, {
            flat: 0,
            radius: 0.1,
            subdivisions: 4,
            updatable: false
        },
        scene);
    sphere.material = new BABYLON.StandardMaterial('Material_' + name, scene);
    sphere.material.ambientColor = color;
    sphere.material.diffuseColor = color;
    return sphere;
}


class Leibniz {
    constructor(props) {
        this.props = props;
    }

    init(options) {
        const _options = _.defaults(options || {}, {
            cameraType: 'do',
            cameraPosition: new BABYLON.Vector3(0, 0, -10),
            cameraMinZ: 0.5,
            ambientColor: new BABYLON.Color3(0.2, 0.2, 0.2),
            sunLightDirection: new BABYLON.Vector3(1, 1, -1),
            sunLightIntensity: 0.7
        });

        const camera = createCamera(this.props.scene, _options);
        camera.attachControl(this.props.canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight(
            'sunLight',
            _options.sunLightDirection,
            this.props.scene);
        light.intensity = _options.sunLightIntensity;

        this.props.scene.ambientColor = _options.ambientColor;

        this._state = {
            funcs: {},
            vars: {},
            update: {},
            bodies: [],
            next: () => this._state
        };

        this.props.scene.onBeforeStepObservable.add((scene) => {
            const ar = scene.getAnimationRatio() || 1;
            const dt = ar / 60;
            this.refreshTime(dt);
        });

        // Adds callback handler on rendering loop
        this.props.engine.runRenderLoop(() => {
            this.refreshScene();
            this.props.scene.render();
        });
    }

    set system(system) {

        // Cleans up scene
        _.each(this._shapes, shape =>
            this.props.scene.removeMesh(shape, true)
        );

        const shapes = _.map(system.bodies, (body, i, ary) => {
            const name = 'Body' + i;
            const color = hsb.fromHeat(ary.length > 1 ? i / (ary.length - 1) : 0);
            const shape = (body.rotation !== undefined)
                ? createOcta(this.props.scene, name, color)
                : createSphere(this.props.scene, name, color);
            this.updateShape(shape, body);
            return shape;
        });
        this._shapes = shapes;
        this._state = system;
        //this.props.engine.render();
        return this;
    }

    refreshTime(dt) {
        this._state = this._state.next(dt);
    }

    refreshScene() {
        _.each(_.zip(this._state.bodies, this._shapes), (ary) =>
            this.updateShape(ary[1], ary[0])
        );
    }

    updateShape(shape, body) {
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

    refresh(){
        this.props.engine.resize();
    }
}

export { Leibniz };
