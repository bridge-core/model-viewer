import { MoLang } from 'molang'
import {
	ISingleAnimation,
	TBoneModifier,
	TTimestampEntry,
} from '../Schema/Animation'
import { MathUtils } from 'three'
import { SoundEffect } from './SoundEffect'
import { ParticleEffect } from './ParticleEffect'
import { Animator } from './Animator'

export class Animation {
	protected startTimestamp = 0
	protected lastFrameTimestamp = 0
	protected isRunning = false
	protected env = {
		'query.anim_time': () => this.currentTime,
		'query.delta_time': () => this.startTimestamp - this.lastFrameTimestamp,
		'query.life_time': () => this.currentTime,
	}
	protected molang = new MoLang(this.env)
	protected soundEffects = new SoundEffect(
		this,
		this.animationData.sound_effects ?? {}
	)
	protected particleEffects = new ParticleEffect(
		this,
		this.animationData.particle_effects ?? {}
	)

	constructor(
		protected animator: Animator,
		protected animationData: ISingleAnimation
	) {}

	getAnimator() {
		return this.animator
	}

	protected execute(expr: string) {
		return this.molang.executeAndCatch(expr)
	}

	parseBoneModifier(transform: TBoneModifier) {
		if (typeof transform === 'string') {
			const res =
				typeof transform === 'string'
					? this.execute(transform)
					: transform
			return [res, res, res] as [number, number, number]
		} else if (Array.isArray(transform)) {
			return transform.map((t) =>
				typeof t === 'string' ? this.execute(t) : t
			) as [number, number, number]
		} else if (transform !== undefined) {
			const timestamps = Object.entries(transform)
				.map(
					([time, transform]) =>
						[Number(time), transform] as [number, TTimestampEntry]
				)
				.sort(([a], [b]) => a - b)

			for (let i = timestamps.length - 1; i >= 0; i--) {
				let [time, transform] = timestamps[i]

				if (time > this.currentTime) {
					continue
				} else if (time === this.currentTime) {
					if (Array.isArray(transform)) {
						return transform as [number, number, number]
					} else {
						// TODO
						throw new Error('Format not supported yet')
					}
				} else {
					// Interpolation between two timestamps
					let [nextTime, nextTransform] = timestamps[
						MathUtils.euclideanModulo(i + 1, timestamps.length)
					]
					let timeDelta = nextTime - time

					if (
						Array.isArray(transform) &&
						Array.isArray(nextTransform)
					) {
						return transform.map(
							(n, i) =>
								n +
								(((<[number, number, number]>nextTransform)[i] -
									n) /
									timeDelta) *
									(this.currentTime - time)
						) as [number, number, number]
					} else {
						// TODO
						throw new Error('Format not supported yet')
					}
				}
			}
			return [0, 0, 0]
		}
	}

	tick() {
		this.soundEffects.tick()
		this.particleEffects.tick()

		const boneMap = this.animator.getModel().getBoneMap()

		for (let boneName in this.animationData.bones) {
			const bone = boneMap.get(boneName)
			if (!bone) continue
			const { position, rotation, scale } = this.animationData.bones[
				boneName
			]
			const [positionMod, rotationMod, scaleMod] = [
				position,
				rotation,
				scale,
			].map((mod) => this.parseBoneModifier(mod))

			if (positionMod) {
				const currentPosition = bone.position.toArray()
				bone.position.set(
					...(positionMod.map(
						(val, i) =>
							(i === 0 ? -1 : 1) * val + currentPosition[i]
					) as [number, number, number])
				)
			}

			if (rotationMod) {
				const currentRotation = bone.rotation.toArray()
				bone.rotation.set(
					...(rotationMod
						.map(MathUtils.degToRad)
						.map(
							(val, i) =>
								currentRotation[i] + (i === 2 ? val : -val)
						) as [number, number, number])
				)
			}

			if (scaleMod)
				bone.scale.set(...(scaleMod as [number, number, number]))
		}

		if (this.currentTime > this.animationData.animation_length) {
			if (this.animationData.loop) this.loop()
			else this.pause()
		}

		// Update lastFrameTimestamp for query.delta_time
		this.lastFrameTimestamp = Date.now()
	}

	play() {
		this.isRunning = true
		this.startTimestamp = Date.now()
	}
	pause() {
		this.isRunning = false
	}
	loop() {
		this.startTimestamp = Date.now()
		this.soundEffects.reset()
		this.particleEffects.reset()
	}
	dispose() {
		this.particleEffects.dispose()
	}

	get currentTime() {
		return (Date.now() - this.startTimestamp) / 1000
	}
	get roundedCurrentTime() {
		return Math.round((Date.now() - this.startTimestamp) / 50) / 20
	}
	get shouldTick() {
		return this.isRunning
	}
}
