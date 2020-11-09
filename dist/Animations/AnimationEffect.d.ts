import { Animation } from './Animation';
export declare abstract class AnimationEffect<T> {
    protected animation: Animation;
    abstract tick(): void;
    protected currentEffectIndex: number;
    protected effects: [number, T][];
    constructor(animation: Animation, timestampObj: T);
    getCurrentEffect(): T | undefined;
    reset(): void;
}
