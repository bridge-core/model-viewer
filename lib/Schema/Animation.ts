export interface IAnimations {
	format_version: '1.8.0'
	animations: {
		[animationID: string]: Partial<ISingleAnimation>
	}
}

export interface ISingleAnimation {
	loop: boolean
	animation_length: number
	anim_time_update: string //MoLang; default: "query.anim_time + query.delta_time"
	blend_weight: string //MoLang
	override_previous_animation: true
	bones: {
		[boneName: string]: IBoneAnim
	}
	sound_effects: TSoundEffects
	particle_effects: TParticleEffects
}

export interface ITimestamp<T> {
	[timeStamp: string]: T
}

export type TSoundEffects = ITimestamp<{ effect: string }>

export type TParticleEffects = ITimestamp<{ effect: string; locator: string }>

export interface IBoneAnim {
	position: TBoneModifier
	rotation: TBoneModifier
	scale: TBoneModifier
}

export type TBoneModifier =
	| string
	| [string, string, string]
	| ITimestamp<TTimestampEntry>
export type TTimestampEntry =
	| [number, number, number]
	| {
			lerp_mode: 'linear' | 'catmullrom'
			pre: [string, string, string]
			post: [string, string, string]
	  }
