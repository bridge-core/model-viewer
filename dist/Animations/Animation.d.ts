import { Model } from '../Model';
import { ISingleAnimation, TBoneModifier } from '../Schema/Animation';
export declare class Animation {
    protected model: Model;
    protected animationData: ISingleAnimation;
    protected startTimeStamp: number;
    protected isRunning: boolean;
    protected env: {
        'query.anim_time': () => number;
    };
    constructor(model: Model, animationData: ISingleAnimation);
    parseBoneModifier(transform: TBoneModifier): number[] | undefined;
    tick(): void;
    play(): void;
    pause(): void;
    get currentTime(): number;
    get shouldTick(): boolean;
}
