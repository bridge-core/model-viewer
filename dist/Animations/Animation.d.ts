import { ModelBuilder } from '../ModelBuilder';
import { ISingleAnimation, TBoneModifier } from '../Schema/Animation';
export declare class Animation {
    protected model: ModelBuilder;
    protected animationData: ISingleAnimation;
    protected currentTick: number;
    protected isRunning: boolean;
    protected env: {
        'query.anim_time': () => number;
    };
    constructor(model: ModelBuilder, animationData: ISingleAnimation);
    parseBoneModifier(transform: TBoneModifier): number[] | undefined;
    tick(): void;
    play(): void;
    pause(): void;
    get currentTime(): number;
    get shouldTick(): boolean;
}
