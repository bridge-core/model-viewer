import {
	AmbientLight,
	AxesHelper,
	Color,
	GridHelper,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Model } from './Model'
import { IGeoSchema } from './Schema/Model'

export { Model } from './Model'

export class StandaloneModelViewer {
	protected renderer: WebGLRenderer
	protected model: Model
	protected scene: Scene
	protected camera: PerspectiveCamera
	protected renderingRequested = false
	protected controls: OrbitControls

	constructor(
		canvasElement: HTMLCanvasElement,
		modelData: IGeoSchema,
		texturePath: string,
		antialias = false
	) {
		this.renderer = new WebGLRenderer({ canvas: canvasElement, antialias })
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.camera = new PerspectiveCamera(75, 2, 0.1, 1000)
		this.camera.position.x = -20
		this.camera.position.y = 20
		this.camera.position.z = -20

		this.camera.updateProjectionMatrix()
		this.controls = new OrbitControls(this.camera, canvasElement)
		this.scene = new Scene()
		this.scene.add(new AmbientLight(0xffffff))
		this.scene.background = new Color(0xcaf0f8)
		this.model = new Model(modelData, texturePath)
		this.scene.add(this.model.getModel())

		window.addEventListener('resize', this.onResize.bind(this))
		this.controls.addEventListener(
			'change',
			this.requestRendering.bind(this)
		)

		this.onResize()
	}

	protected render() {
		this.controls.update()
		this.renderer.render(this.scene, this.camera)
		this.renderingRequested = false

		if (this.model.shouldTick) {
			this.model.tick()
			this.requestRendering()
		}
	}

	requestRendering() {
		if (this.renderingRequested) return

		this.renderingRequested = true
		requestAnimationFrame(this.render.bind(this))
	}
	protected onResize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight, true)
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
	}
	dispose() {
		window.removeEventListener('resize', this.onResize)
		this.controls.removeEventListener('change', this.requestRendering)
	}

	addHelpers() {
		this.scene.add(new AxesHelper(50))
		this.scene.add(new GridHelper(20, 20))
		this.requestRendering()
	}
	getModel() {
		return this.model
	}
}
