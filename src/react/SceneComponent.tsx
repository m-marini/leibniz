import { Component } from 'react';
import { Engine, Scene } from '@babylonjs/core';

/**
 * 
 */
export interface SceneMountEvent {
  engine: Engine;
  scene: Scene;
  canvas: HTMLCanvasElement;
}

/**
 * 
 */
interface BabylonSceneProps {
  canvasClass?: string;
  onSceneMount?: (ev: any) => void;
};

/**
 * 
 */
export class BabylonScene extends Component<BabylonSceneProps, {
  canvas?: HTMLCanvasElement;
  engine?: Engine;
  scene?: Scene;
}> {

  /**
   * 
   * @param props 
   */
  constructor(props: BabylonSceneProps) {
    super(props);
    this.state = {};
  }

  /**
   * 
   */
  componentDidMount() {
    window.addEventListener('resize', this.onResizeWindow);
  }

  /**
   * 
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow);
  }

  /**
   * 
   */
  private onResizeWindow = () => {
    const { engine } = this.state;
    engine?.resize();
  }

  /**
   * 
   * @param canvas 
   */
  private onCanvasLoaded(canvas: HTMLCanvasElement | null) {
    const { onSceneMount } = this.props;
    const { engine } = this.state;
    if (canvas && !engine) {
      const engine = new Engine(canvas, true,
        {
          deterministicLockstep: true,
          lockstepMaxSteps: 4
        });

      const scene = new Scene(engine);

      if (onSceneMount) {
        onSceneMount({ scene, engine, canvas });
      }

      // Resize the babylon engine when the window is resized
      this.setState({ engine, scene, canvas });
    }
  }

  /**
   * 
   */
  render() {
    return (
      <canvas className={this.props.canvasClass} ref={c => this.onCanvasLoaded(c)} />
    );
  }
}
