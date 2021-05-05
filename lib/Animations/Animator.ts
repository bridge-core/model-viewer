import { ISingleAnimation } from '../Schema/Animation'
import { Model } from '../Model'
import { Animation } from './Animation'
import Wintersky from 'wintersky'

export class Animator {
	public winterskyScene?: Wintersky.Scene

	protected animations = new Map<string, Animation>()
	protected particleEmitters = new Map<string, Wintersky.Config>()

	constructor(protected model: Model) {}

	setupDefaultBonePoses() {
		//Save default rotation & position
		for (let bone of this.model.getBoneMap().values()) {
			bone.userData.defaultRotation = bone.rotation.toArray()
			bone.userData.defaultPosition = bone.position.toArray()
		}
	}

	dispose() {
		// Remove custom animation data from bones
		for (let bone of this.model.getBoneMap().values()) {
			delete bone.userData.defaultRotation
			delete bone.userData.defaultPosition
		}
	}
	disposeAnimations() {
		this.animations.forEach((anim) => anim.dispose())
	}

	setupWintersky(winterskyScene: Wintersky.Scene) {
		this.winterskyScene = winterskyScene
	}
	addAnimation(id: string, animationData: ISingleAnimation) {
		this.animations.set(id, new Animation(this, animationData))
	}
	addEmitter(shortName: string, emitterConfig: Wintersky.Config) {
		this.particleEmitters.set(shortName, emitterConfig)
	}
	getEmitter(shortName: string) {
		return this.particleEmitters.get(shortName)
	}

	play(id: string) {
		const animation = this.animations.get(id)
		if (!animation) throw new Error(`Unknown animation: "${id}"`)
		animation.play()
	}
	pause(id: string) {
		const animation = this.animations.get(id)
		if (!animation) throw new Error(`Unknown animation: "${id}"`)
		animation.pause()
	}
	pauseAll() {
		for (const animation of this.animations.values()) {
			animation.pause()
		}
	}

	tick() {
		// Reset currentTick data
		for (let bone of this.model.getBoneMap().values()) {
			bone.rotation.set(
				...(bone.userData.defaultRotation as [number, number, number])
			)
			bone.position.set(
				...(bone.userData.defaultPosition as [number, number, number])
			)
		}

		this.animations.forEach(
			(animation) => animation.shouldTick && animation.tick()
		)
	}
	get shouldTick() {
		return [...this.animations.values()].some(
			(animation) => animation.shouldTick
		)
	}

	getModel() {
		return this.model
	}
}
