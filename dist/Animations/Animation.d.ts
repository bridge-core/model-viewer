import { Model } from '../Model';
import { ISingleAnimation, TBoneModifier } from '../Schema/Animation';
import { SoundEffect } from './SoundEffect';
import { ParticleEffect } from './ParticleEffect';
export declare class Animation {
    protected model: Model;
    protected animationData: ISingleAnimation;
    protected startTimeStamp: number;
    protected isRunning: boolean;
    protected env: {
        'query.anim_time': () => number;
    };
    protected soundEffects: SoundEffect;
    protected particleEffects: ParticleEffect;
    constructor(model: Model, animationData: ISingleAnimation);
    parseBoneModifier(transform: TBoneModifier): number[] | undefined;
    tick(): void;
    play(): void;
    pause(): void;
    loop(): void;
    get currentTime(): number;
    get roundedCurrentTime(): number;
    get shouldTick(): boolean;
}
