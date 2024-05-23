import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Model } from './Model';
import { IGeoSchema } from './Schema/Model';
export { Model } from './Model';
export * from './Schema/Model';
export * from './Schema/Animation';
export interface IOptions {
    alpha?: boolean;
    antialias?: boolean;
    width?: number;
    height?: number;
}
export declare class StandaloneModelViewer {
    protected canvasElement: HTMLCanvasElement;
    protected texturePath: string;
    protected options: IOptions;
    protected renderer: WebGLRenderer;
    protected model: Model;
    readonly scene: Scene;
    protected camera: PerspectiveCamera;
    protected renderingRequested: boolean;
    readonly controls: OrbitControls;
    readonly loadedModel: Promise<void>;
    constructor(canvasElement: HTMLCanvasElement, modelData: IGeoSchema, texturePath: string, options: IOptions);
    protected loadModel(): Promise<void>;
    protected get width(): number;
    protected get height(): number;
    protected render(checkShouldTick?: boolean): void;
    requestRendering(immediate?: boolean): void;
    protected onResize(): void;
    dispose(): void;
    addHelpers(): void;
    getModel(): Model;
    positionCamera(scale?: number, rotate?: boolean): void;
}
