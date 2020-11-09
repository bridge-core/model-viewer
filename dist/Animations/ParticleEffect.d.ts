import { TParticleEffects } from '../Schema/Animation';
import { AnimationEffect } from './AnimationEffect';
export declare class ParticleEffect extends AnimationEffect<TParticleEffects> {
    tick(): void;
}
