import React from 'react';
import * as BABYLON from 'babylonjs';

class BabylonScene extends React.Component {

  componentDidMount() {
    this.engine = new BABYLON.Engine(this.canvas, true,
      {
        deterministicLockstep: true,
        lockstepMaxSteps: 4
      });

    const scene = new BABYLON.Scene(this.engine);
    this.scene = scene;

    if (typeof this.props.onSceneMount === 'function') {
      this.props.onSceneMount({
        scene: scene,
        engine: this.engine,
        canvas: this.canvas
      });
    } else {
      console.error('onSceneMount function not available');
    }

    // Resize the babylon engine when the window is resized
    window.addEventListener('resize', this.onResizeWindow);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow);
  }

  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
    }
  }

  onCanvasLoaded(c) {
    if (c !== null) {
      this.canvas = c;
    }
  }

  render() {
    return (
      <canvas className={this.props.canvasClass} ref={(c) => this.onCanvasLoaded(c)} />
    );
  }
}

export { BabylonScene }