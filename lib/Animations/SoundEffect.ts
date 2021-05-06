import { ISoundEffect } from '../Schema/Animation'
import { AnimationEffect } from './AnimationEffect'

export class SoundEffect extends AnimationEffect<ISoundEffect> {
	tick() {
		const timestampEntry = super.getCurrentEffects() ?? []
		if (timestampEntry.length > 0)
			console.log(
				`Playing sound effects: "${timestampEntry
					.map((entry) => entry.effect)
					.join(', ')}"`
			)
	}
}
