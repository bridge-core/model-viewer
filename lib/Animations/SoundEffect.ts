import { TSoundEffects } from '../Schema/Animation'
import { AnimationEffect } from './AnimationEffect'

export class SoundEffect extends AnimationEffect<TSoundEffects> {
	tick() {
		const timestampEntry = super.getCurrentEffect()
		if (timestampEntry)
			console.log(`Playing sound "${timestampEntry.effect}"`)
	}
}
