import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Model } from './Model';
import { IGeoSchema } from './Schema/Model';
export { Model } from './Model';
export declare class StandaloneModelViewer {
    protected renderer: WebGLRenderer;
    protected model: Model;
    protected scene: Scene;
    protected camera: PerspectiveCamera;
    protected renderingRequested: boolean;
    protected controls: OrbitControls;
    constructor(canvasElement: HTMLCanvasElement, modelData: IGeoSchema, texturePath: string, antialias?: boolean);
    protected render(): void;
    requestRendering(): void;
    protected onResize(): void;
    dispose(): void;
    addHelpers(): void;
}
