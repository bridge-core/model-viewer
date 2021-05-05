import { IParticleEffect } from '../Schema/Animation'
import { AnimationEffect } from './AnimationEffect'
import Wintersky from 'wintersky'
import { IDisposable } from '../Disposable'

export class ParticleEffect extends AnimationEffect<IParticleEffect> {
	protected disposable?: IDisposable

	tick() {
		this.tickingEffects.forEach((effect) => effect.tick())

		const { locator, effect, pre_effect_script } =
			super.getCurrentEffect() ?? {}

		if (!effect) return

		const animator = this.animation.getAnimator()
		const model = animator.getModel()
		const emitterConfig = animator.getEmitter(effect)
		if (!emitterConfig || !animator.winterskyScene) return

		const locatorGroup = locator ? model.getLocator(locator) : undefined

		const emitter = new Wintersky.Emitter(
			animator.winterskyScene,
			emitterConfig,
			{
				parent_mode: locatorGroup ? 'locator' : 'entity',
				loop_mode: 'once',
			}
		)

		if (locatorGroup) {
			locatorGroup.add(emitter.local_space)
			emitter.local_space.parent = locatorGroup
		}

		const tickable = {
			tick: () => {
				emitter.tick()

				// @ts-ignore
				if (!emitter.enabled) {
					emitter.delete()

					this.tickingEffects = this.tickingEffects.filter(
						(current) => current !== tickable
					)
				}
			},
		}
		this.tickingEffects.push(tickable)
		this.disposable = {
			dispose: () => {
				emitter.delete()
				this.tickingEffects = this.tickingEffects.filter(
					(current) => current !== tickable
				)
			},
		}

		emitter.start()
		emitter.tick()
	}

	dispose() {
		this.disposable?.dispose()
	}
}
