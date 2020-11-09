import { Animation } from './Animation';
export declare class AnimationEffect<T> {
    protected animation: Animation;
    protected currentEffectIndex: number;
    protected effects: [number, T][];
    constructor(animation: Animation, timestampObj: T);
    getCurrentEffect(): T | undefined;
    reset(): void;
}
