import { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IGeoSchema } from './modelSchema';
export declare class ModelViewer {
    protected scene: Scene;
    protected model: Group;
    constructor(scene: Scene, modelData: IGeoSchema, texturePath: string);
}
export declare class StandaloneModelViewer {
    protected renderer: WebGLRenderer;
    protected modelViewer: ModelViewer;
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
