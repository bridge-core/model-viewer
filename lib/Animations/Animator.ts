import { ISingleAnimation } from '../Schema/Animation'
import { ModelBuilder } from '../ModelBuilder'
import { Animation } from './Animation'

export class Animator {
	protected animations = new Map<string, Animation>()
	constructor(protected model: ModelBuilder) {}

	setupDefaultBonePoses() {
		//Save default rotation & position
		for (let bone of this.model.getBoneMap().values()) {
			bone.userData.defaultRotation = [
				bone.rotation.x,
				bone.rotation.y,
				bone.rotation.z,
			]
			bone.userData.defaultPosition = [
				bone.position.x,
				bone.position.y,
				bone.position.z,
			]
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
		this.animations.forEach((animation) => animation.tick())
	}
	get shouldTick() {
		return [...this.animations.values()].some(
			(animation) => animation.shouldTick
		)
	}
}
