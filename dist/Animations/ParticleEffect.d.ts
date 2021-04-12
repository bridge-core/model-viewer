import { IParticleEffect } from '../Schema/Animation';
import { AnimationEffect } from './AnimationEffect';
export declare class ParticleEffect extends AnimationEffect<IParticleEffect> {
    tick(): void;
}
