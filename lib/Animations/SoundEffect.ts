import { ISoundEffect } from '../Schema/Animation'
import { AnimationEffect } from './AnimationEffect'

export class SoundEffect extends AnimationEffect<ISoundEffect> {
	tick() {
		const timestampEntry = super.getCurrentEffect()
		if (timestampEntry)
			console.log(`Playing sound "${timestampEntry.effect}"`)
	}
}
