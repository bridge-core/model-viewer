import { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IGeoSchema } from './modelSchema';
export declare class ModelBuilder {
    protected model: Group;
    constructor(modelData: IGeoSchema, texturePath: string);
    getModel(): Group;
}
export declare class StandaloneModelViewer {
    protected renderer: WebGLRenderer;
    protected modelBuilder: ModelBuilder;
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
