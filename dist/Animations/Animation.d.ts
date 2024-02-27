import { Molang } from 'molang';
import { ISingleAnimation, TBoneModifier } from '../Schema/Animation';
import { SoundEffect } from './SoundEffect';
import { ParticleEffect } from './ParticleEffect';
import { Animator } from './Animator';
export declare class Animation {
    protected animator: Animator;
    protected animationData: ISingleAnimation;
    protected startTimestamp: number;
    protected lastFrameTimestamp: number;
    protected isRunning: boolean;
    protected env: {
        'query.anim_time': () => number;
        'query.delta_time': () => number;
        'query.life_time': () => number;
    };
    protected molang: Molang;
    protected soundEffects: SoundEffect;
    protected particleEffects: ParticleEffect;
    constructor(animator: Animator, animationData: ISingleAnimation);
    getAnimator(): Animator;
    protected execute(expr: string): unknown;
    parseBoneModifier(transform: TBoneModifier): number[] | undefined;
    tick(): void;
    play(): void;
    pause(): void;
    loop(): void;
    dispose(): void;
    get currentTime(): number;
    get roundedCurrentTime(): number;
    get shouldTick(): boolean;
}
