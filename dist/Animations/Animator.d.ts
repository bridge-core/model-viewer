import { ISingleAnimation } from '../Schema/Animation';
import { Model } from '../Model';
import { Animation } from './Animation';
export declare class Animator {
    protected model: Model;
    protected animations: Map<string, Animation>;
    constructor(model: Model);
    setupDefaultBonePoses(): void;
    dispose(): void;
    addAnimation(id: string, animationData: ISingleAnimation): void;
    play(id: string): void;
    pause(id: string): void;
    tick(): void;
    get shouldTick(): boolean;
}
