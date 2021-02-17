import { StandaloneModelViewer } from '../lib/main'
import { animation, model, sleepAnimation } from './model'

const canvas = document.getElementById('renderTarget')

export const viewer = new StandaloneModelViewer(
	canvas,
	model,
	'pesky_dragon.png',
	{
		antialias: true,
	}
)
viewer.getModel().animator.addAnimation('idle', animation)
viewer.getModel().animator.addAnimation('sleep', sleepAnimation)
// viewer.addHelpers()
viewer.positionCamera()
setTimeout(() => viewer.requestRendering(), 100)
// viewer.getModel().animator.play('sleep')
// viewer.getModel().animator.play('idle')
