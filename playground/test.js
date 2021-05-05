import { StandaloneModelViewer } from '../lib/main'
import {
	animation,
	model as modelJson,
	particle,
	sleepAnimation,
} from './model'
import Wintersky from 'wintersky'

const canvas = document.getElementById('renderTarget')

export const viewer = new StandaloneModelViewer(
	canvas,
	modelJson,
	'pesky_dragon.png',
	{
		antialias: true,
	}
)
const model = viewer.getModel()
const winterskyScene = new Wintersky.Scene()
winterskyScene.global_options.loop_mode = 'once'
winterskyScene.global_options.scale = 16

viewer.scene.add(winterskyScene.space)

model.animator.setupWintersky(winterskyScene)
model.animator.addEmitter(
	'heart',
	new Wintersky.Config(winterskyScene, particle)
)
model.animator.addAnimation('idle', animation)
model.animator.addAnimation('sleep', sleepAnimation)
// viewer.addHelpers()
viewer.positionCamera()
setTimeout(() => viewer.requestRendering(), 100)
model.animator.play('sleep')
// model.animator.play('idle')
console.log(model)

model.createOutlinedBox('#ff6700', { x: 16, y: 8, z: 16 })

model.createOutlinedBox('#006712', { x: 12, y: 20, z: 8 })
