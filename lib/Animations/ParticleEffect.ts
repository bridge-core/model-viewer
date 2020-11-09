import { TParticleEffects } from '../Schema/Animation'
import { AnimationEffect } from './AnimationEffect'

export class ParticleEffect extends AnimationEffect<TParticleEffects> {
	tick() {
		const timestampEntry = super.getCurrentEffect()
		if (timestampEntry)
			console.log(
				`Playing particle "${timestampEntry.effect}" at locator "${timestampEntry.locator}"`
			)
	}
}
