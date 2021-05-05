import { IParticleEffect } from '../Schema/Animation';
import { AnimationEffect } from './AnimationEffect';
import { IDisposable } from '../Disposable';
export declare class ParticleEffect extends AnimationEffect<IParticleEffect> {
    protected disposable?: IDisposable;
    tick(): void;
    dispose(): void;
}
