import { IParticleEffect } from '../Schema/Animation'
import { AnimationEffect } from './AnimationEffect'
import Wintersky from 'wintersky'

export class ParticleEffect extends AnimationEffect<IParticleEffect> {
	tick() {
		const { locator, effect, pre_effect_script } =
			super.getCurrentEffect() ?? {}

		if (!effect) return

		const animator = this.animation.getAnimator()
		const model = animator.getModel()
		const emitterConfig = animator.getEmitter(effect)
		if (!emitterConfig || !animator.winterskyScene) return

		const emitter = new Wintersky.Emitter(
			animator.winterskyScene,
			emitterConfig
		)
		const locatorGroup = locator ? model.getLocator(locator) : undefined

		// @ts-ignore
		emitter.loop_mode = 'once'

		if (locatorGroup) {
			// @ts-ignore
			emitter.parent_mode = 'locator'
			// @ts-ignore
			locatorGroup.add(emitter.local_space)
		} else {
			// @ts-ignore
			emitter.parent_mode = 'entity'
		}

		// @ts-ignore
		model.getModel().add(emitter.global_space)

		emitter?.start()
	}
}
