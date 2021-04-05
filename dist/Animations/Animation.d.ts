import { Model } from '../Model';
import { MoLang } from 'molang';
import { ISingleAnimation, TBoneModifier } from '../Schema/Animation';
import { SoundEffect } from './SoundEffect';
import { ParticleEffect } from './ParticleEffect';
export declare class Animation {
    protected model: Model;
    protected animationData: ISingleAnimation;
    protected startTimestamp: number;
    protected lastFrameTimestamp: number;
    protected isRunning: boolean;
    protected env: {
        'query.anim_time': () => number;
        'query.delta_time': () => number;
        'query.life_time': () => number;
    };
    protected molang: MoLang;
    protected soundEffects: SoundEffect;
    protected particleEffects: ParticleEffect;
    constructor(model: Model, animationData: ISingleAnimation);
    protected execute(expr: string): unknown;
    parseBoneModifier(transform: TBoneModifier): number[] | undefined;
    tick(): void;
    play(): void;
    pause(): void;
    loop(): void;
    get currentTime(): number;
    get roundedCurrentTime(): number;
    get shouldTick(): boolean;
}
