export interface IAnimations {
    format_version: '1.8.0';
    animations: {
        [animationID: string]: Partial<ISingleAnimation>;
    };
}
export interface ISingleAnimation {
    loop: boolean;
    animation_length: number;
    anim_time_update: string;
    blend_weight: string;
    override_previous_animation: true;
    bones: {
        [boneName: string]: IBoneAnim;
    };
}
export interface IBoneAnim {
    position: TBoneModifier;
    rotation: TBoneModifier;
    scale: TBoneModifier;
}
export declare type TBoneModifier = string | [string, string, string] | {
    [time: string]: TTimestamp;
};
export declare type TTimestamp = [number, number, number] | {
    lerp_mode: 'linear' | 'catmullrom';
    pre: [string, string, string];
    post: [string, string, string];
};
