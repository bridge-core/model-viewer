import { ITimestamp } from '../Schema/Animation'
import { Animation } from './Animation'

export abstract class AnimationEffect<T> {
	abstract tick(): void

	protected currentEffectIndex = 0
	protected effects: (readonly [number, T[]])[]
	protected tickingEffects: { tick: () => void }[] = []

	constructor(protected animation: Animation, timestampObj: ITimestamp<T>) {
		this.effects = Object.entries(timestampObj)
			.map(
				([time, timestampEntry]) =>
					<const>[
						Number(time),
						Array.isArray(timestampEntry)
							? timestampEntry
							: [timestampEntry],
					]
			)
			.sort(([a], [b]) => a - b)
	}

	getCurrentEffects() {
		// We have no effects to play anymore
		if (this.currentEffectIndex >= this.effects.length) return

		const currentEffect = this.effects[this.currentEffectIndex]
		// Time of currentEffect not reached yet, early return
		if (currentEffect[0] > this.animation.roundedCurrentTime) return

		this.currentEffectIndex++
		return currentEffect[1]
	}

	reset() {
		this.currentEffectIndex = 0
	}
}
