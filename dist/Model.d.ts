import { Group, Texture } from 'three';
import { Animator } from './Animations/Animator';
import { IGeoSchema } from './Schema/Model';
export declare class Model {
    protected modelData: IGeoSchema;
    protected texturePath: string;
    protected model: Group;
    protected boneMap: Map<string, Group>;
    protected locators: Map<string, Group>;
    readonly animator: Animator;
    constructor(modelData: IGeoSchema, texturePath: string);
    create(): Promise<void>;
    getGroup(): Group;
    getBoneMap(): Map<string, Group>;
    getLocator(name: string): Group | undefined;
    tick(): void;
    get shouldTick(): boolean;
    createOutlineBox(color: `#${string}`, position: {
        x: number;
        y: number;
        z: number;
    }, size: {
        x: number;
        y: number;
        z: number;
    }): {
        dispose: () => void;
    };
    hideBone(name: string): void;
    showBone(name: string): void;
    get bones(): string[];
    dispose(): void;
    protected loadTexture(url: string): Promise<Texture>;
}
