import { Group } from 'three';
import { Animator } from './Animations/Animator';
import { IGeoSchema } from './Schema/Model';
export declare class Model {
    protected model: Group;
    protected boneMap: Map<string, Group>;
    protected locators: Map<string, Group>;
    readonly animator: Animator;
    constructor(modelData: IGeoSchema, texturePath: string);
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
    dispose(): void;
}
