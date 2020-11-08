import { ISingleAnimation } from '../Schema/Animation'
import { Model } from '../Model'
import { Animation } from './Animation'

export class Animator {
	protected animations = new Map<string, Animation>()
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

	addAnimation(id: string, animationData: ISingleAnimation) {
		this.animations.set(id, new Animation(this.model, animationData))
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
}
