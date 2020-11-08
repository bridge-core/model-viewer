import { Group } from 'three';
import { Animator } from './Animations/Animator';
import { IGeoSchema } from './Schema/Model';
export declare class ModelBuilder {
    protected model: Group;
    protected boneMap: Map<string, Group>;
    protected animator: Animator;
    constructor(modelData: IGeoSchema, texturePath: string);
    getModel(): Group;
    getBoneMap(): Map<string, Group>;
    tick(): void;
    get shouldTick(): boolean;
    dispose(): void;
}
