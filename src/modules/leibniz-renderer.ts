import {
    AnaglyphArcRotateCamera, ArcRotateCamera, Color3, DeviceOrientationCamera,
    HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial,
    Vector3, VRDeviceOrientationArcRotateCamera, UniversalCamera, AxesViewer
} from '@babylonjs/core';
import { default as _ } from 'lodash';
import { SceneMountEvent } from '../react/SceneComponent';
import { SystemRules, BodyStatus, InternalStatus } from './leibniz-defs';
import { Observable, Subject } from 'rxjs';

const MAX_ITERATIONS = 3;
const BODY_SPHERE_RADIUS = 0.1;
const AXIS_LENGTH = BODY_SPHERE_RADIUS * 2;
const BODY_ROTATING_SIZE = BODY_SPHERE_RADIUS;

export enum CameraType {
    DeviceOrientation = 'do',
    Anaglyph = 'ac',
    VRDeviceOrientation = 'vr',
    ArcRotate = 'ar',
    Universal = 'un'
};

interface SceneOptions {
    cameraType: CameraType;
    cameraPosition: Vector3;
    maxDt: number;
    sunLightDirection: Vector3;
};

const FPS = 60;

const Octahedron = 1;

/*
 * Returns the Color3 for HSB value (Hue, Saturation, Bright)
 */
function fromHSB(h: number, s: number, b: number) {
    var hc = null;
    if (h <= 0) {
        hc = Color3.Red();
    } else if (h < 1 / 6) {
        hc = new Color3(1, h * 6, 0);
    } else if (h < 2 / 6) {
        hc = new Color3(2 - 6 * h, 1, 0);
    } else if (h < 3 / 6) {
        hc = new Color3(0, 1, h * 6 - 2);
    } else if (h < 4 / 6) {
        hc = new Color3(0, 4 - h * 6, 1);
    } else if (h < 5 / 6) {
        hc = new Color3(h * 6 - 4, 0, 1);
    } else if (h < 1) {
        hc = new Color3(1, 0, 6 - h * 6);
    } else {
        hc = Color3.Red();
    }
    const sc = Color3.White().scale(1 - s).add(hc.scale(s));
    return sc.scale(b);
}

/*
 * Returns the Color3 of heat color scale (Violet to Red)
 */
function fromHeat(h: number) {
    return fromHSB((1 - h) * 5 / 6, 1, 1 - (1 - h) * 0.2);
}

/**
* 
* @param scene 
* @param options 
*/
function createCamera(scene: Scene, options: SceneOptions) {
    switch (options.cameraType) {
        case CameraType.DeviceOrientation: {
            const camera = new DeviceOrientationCamera('DevOr_camera', new Vector3(0, 0, 0), scene);
            camera.position = options.cameraPosition;
            camera.setTarget(Vector3.Zero());
            camera.angularSensibility = 10;
            // camera.moveSensibility = 10;
            return camera;
        }
        case CameraType.Anaglyph: {
            const camera = new AnaglyphArcRotateCamera('aar_cam', -Math.PI / 2, Math.PI / 4, 20, Vector3.Zero(), 0.033, scene);
            camera.target = Vector3.Zero();
            camera.setPosition(options.cameraPosition);
            return camera;
        }
        case CameraType.VRDeviceOrientation: {
            const camera = new VRDeviceOrientationArcRotateCamera('Camera', Math.PI / 2, Math.PI / 4, 25, new Vector3(0, 0, 0), scene);
            camera.target = Vector3.Zero();
            camera.setPosition(options.cameraPosition);
            return camera;
        }
        case CameraType.ArcRotate: {
            const camera = new ArcRotateCamera('ArcRotateCamera', 0, 0, 0, new Vector3(0, 0, 0), scene);
            camera.wheelPrecision = 20;
            camera.setPosition(options.cameraPosition);
            return camera;
        }
        default: {
            const camera = new UniversalCamera('UniversalCamera', options.cameraPosition, scene);
            camera.inputs.addMouseWheel();
            return camera;
        }
    }
}


/**
 * 
 * @param shape 
 * @param body 
 */
function updateShape(shape: Mesh, body: BodyStatus) {
    shape.position = new Vector3(
        body.position.get(0),
        body.position.get(1),
        body.position.get(2));
    if (body.rotation) {
        shape.rotationQuaternion = body.rotation;
    }
}


/**
 * 
 * @param bodies 
 */
function createShapes(scene: Scene, bodies: BodyStatus[]) {
    const n = bodies.length;
    const shapes = _.map(bodies, (body, i) => {
        const name = 'Body' + i;
        const color = fromHeat(n > 1 ? i / (n - 1) : 0);
        const mesh = (body.rotation !== undefined)
            ? createOcta(scene, name, color)
            : createSphere(scene, name, color);
        updateShape(mesh, body);
        return mesh;
    });
    return shapes;
}

/**
* Returns the mesh of rotated body
* @param scene the scene
* @param name the body name
* @param color the color
 */
function createOcta(scene: Scene, name: string, color: Color3) {
    const material = new StandardMaterial('Material_' + name, scene);
    material.ambientColor = color;
    material.diffuseColor = color;

    const shape = MeshBuilder.CreatePolyhedron(
        'Octa_' + name, {
        type: Octahedron,
        sizeX: BODY_ROTATING_SIZE,
        sizeY: BODY_ROTATING_SIZE,
        sizeZ: BODY_ROTATING_SIZE,
    },
        scene
    );
    shape.material = material;
    const axes = new AxesViewer(scene, AXIS_LENGTH);
    axes.xAxis.parent = shape;
    axes.yAxis.parent = shape;
    axes.zAxis.parent = shape;
    return shape;
}

/**
 * 
 * @param scene 
 * @param name 
 * @param color 
 */
function createSphere(scene: Scene, name: string, color: Color3) {
    const material = new StandardMaterial('Material_' + name, scene);
    material.ambientColor = color;
    material.diffuseColor = color;

    const sphere = MeshBuilder.CreateIcoSphere(
        'Sphere_' + name, {
        flat: false,
        radius: 0.1,
        subdivisions: 4,
        updatable: false
    },
        scene);
    sphere.material = material;
    return sphere;
}

/**
 * Leibniz manages the 3D animation
 * 
 * flow:
 * create
 * init (create and bind meshes to system, add time listener)
 * 
 * setState to change to rules and recreate the new scene
 * 
 * refresh to refresh the scene in case of resize
 */
export class Leibniz {
    private _props: SceneMountEvent;
    private _maxDt: number;
    private _status?: InternalStatus;
    private _rules?: SystemRules;
    private _shapes: Mesh[];
    private _remainderT: number;
    private _speedSubj: Subject<number>;

    /**
     * 
     * @param props 
     */
    constructor(props: SceneMountEvent) {
        this._props = props;
        this._maxDt = 1 / FPS;
        this._shapes = [];
        this._remainderT = 0;
        this._speedSubj = new Subject<number>();
    }

    /**
     * 
     */
    get props() { return this._props; }

    /**
     * 
     */
    get rules() { return this._rules; }

    /**
     * 
     */
    get status() { return this._status; }

    /**
     * 
     */
    get shapes() { return this._shapes; }

    /**
     * 
     */
    get maxDt() { return this._maxDt; }

    /**
     * 
     */
    set maxDt(dt: number) { this._maxDt = dt; }

    /**
     * 
     */
    set rules(rules: SystemRules | undefined) {
        // Cleans up scene
        _.each(this._shapes, shape =>
            this.props.scene.removeMesh(shape, true)
        );

        if (rules) {
            const status = rules.initialStatus();
            const bodies = rules.bodies(status);
            this._shapes = createShapes(this.props.scene, bodies);
            this._status = status;
        } else {
            this._status = undefined;
            this._shapes = [];
        }
        this._rules = rules;
    }

    /**
     * Returns the speed observable
     */
    readSpeed(): Observable<number> {
        return this._speedSubj;
    }

    /**
     * Simulates the time elapsed just in time
     * @param scene the scene
     */
    private simulateJIT(scene: Scene) {
        const { rules, status } = this;
        if (rules && status) {
            const realDt = scene.getEngine().getDeltaTime() / 1000;
            const dt = Math.min(realDt, this.maxDt);
            if (dt > 0) {
                const n = Math.round(realDt / dt);
                const m = Math.min(n, MAX_ITERATIONS)
                var st = status;
                for (var i = 0; i < m; i++) {
                    st = rules.next(st, dt);
                }
                this._status = st;
                const speed = m * dt / realDt
                this._speedSubj.next(speed);
                /*
                var st = status;
                const n = Math.min(n1, MAX_ITERATIONS);
                console.log(n, n1);
                for (var i = 0; i < n; i++) {
                    st = rules.next(st, dt);
                }
                this._remainderT += dt * n - realDt;
                this._status = st;
                */
            }
        }
    }

    /**
     * Simulates the time elapsed accumulated
     * @param scene the scene
     */
    private simulateAcc(scene: Scene) {
        const { rules, status } = this;
        if (rules && status) {
            const realDt = scene.getEngine().getDeltaTime() / 1000;
            const dt = Math.min(realDt, this.maxDt);
            if (dt > 0) {
                var st = status;
                for (var t = this._remainderT; t < realDt; t += dt) {
                    st = rules.next(st, dt);
                }
                this._status = st;
                this._remainderT = t - realDt;
                const speed = t / realDt;
                this._speedSubj.next(speed);
            }
        }
    }

    /**
     * Initializes liebniz simulator
     * @param options the options
     */
    init(options?: Partial<SceneOptions>): Leibniz {
        const { engine, scene } = this.props;

        const _options = _.assign({
            cameraType: CameraType.DeviceOrientation,
            cameraPosition: new Vector3(0, 0, -10),
            cameraMinZ: 0.5,
            ambientColor: new Color3(0.2, 0.2, 0.2),
            sunLightDirection: new Vector3(1, 1, -1),
            sunLightIntensity: 0.7,
            maxDt: 1 / FPS
        }, options || {});

        this._maxDt = _options.maxDt;

        const camera = createCamera(this.props.scene, _options);
        camera.attachControl(this.props.canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight(
            'sunLight',
            _options.sunLightDirection,
            this.props.scene);
        light.intensity = _options.sunLightIntensity;

        scene.ambientColor = _options.ambientColor;
        scene.onBeforeStepObservable.add((scene) =>
            //this.simulateJIT(scene)
            this.simulateAcc(scene)
        );
        new AxesViewer(scene, AXIS_LENGTH);
        // Adds callback handler on rendering loop
        engine.runRenderLoop(() => {
            this.refreshScene();
            scene.render();
        });
        return this;
    }

    /**
     *
     */
    private refreshScene() {
        const { status, shapes, rules } = this;
        if (status && rules) {
            const bodies = rules.bodies(status);
            _.zip(bodies, shapes).forEach(([body, shape]) => {
                if (body && shape) {
                    updateShape(shape, body);
                }
            });
        }
    }

    /**
     * 
     */
    refresh() {
        this.props.engine.resize();
    }

    /**
     * 
     */
    resetStatus() {
        this._remainderT = 0;
        const { rules } = this;
        if (rules) {
            this._status = rules.initialStatus();
        }
    }
}
