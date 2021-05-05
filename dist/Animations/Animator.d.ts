import { ISingleAnimation } from '../Schema/Animation';
import { Model } from '../Model';
import { Animation } from './Animation';
import Wintersky from 'wintersky';
export declare class Animator {
    protected model: Model;
    winterskyScene?: Wintersky.Scene;
    protected animations: Map<string, Animation>;
    protected particleEmitters: Map<string, Wintersky.Config>;
    constructor(model: Model);
    setupDefaultBonePoses(): void;
    dispose(): void;
    disposeAnimations(): void;
    setupWintersky(winterskyScene: Wintersky.Scene): void;
    addAnimation(id: string, animationData: ISingleAnimation): void;
    addEmitter(shortName: string, emitterConfig: Wintersky.Config): void;
    getEmitter(shortName: string): Wintersky.Config | undefined;
    play(id: string): void;
    pause(id: string): void;
    pauseAll(): void;
    tick(): void;
    get shouldTick(): boolean;
    getModel(): Model;
}
