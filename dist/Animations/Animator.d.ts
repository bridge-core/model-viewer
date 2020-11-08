import { ISingleAnimation } from '../Schema/Animation';
import { ModelBuilder } from '../ModelBuilder';
import { Animation } from './Animation';
export declare class Animator {
    protected model: ModelBuilder;
    protected animations: Map<string, Animation>;
    constructor(model: ModelBuilder);
    setupDefaultBonePoses(): void;
    dispose(): void;
    addAnimation(id: string, animationData: ISingleAnimation): void;
    play(id: string): void;
    pause(id: string): void;
    tick(): void;
    get shouldTick(): boolean;
}
