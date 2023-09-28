import {
	AmbientLight,
	AxesHelper,
	Box3,
	BoxHelper,
	Color,
	GridHelper,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	Sphere,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Model } from './Model'
import { IGeoSchema } from './Schema/Model'

export { Model } from './Model'

export * from './Schema/Model'
export * from './Schema/Animation'

export interface IOptions {
	antialias?: boolean
	width?: number
	height?: number
}

export class StandaloneModelViewer {
	protected renderer: WebGLRenderer
	protected model: Model
	protected scene: Scene
	protected camera: PerspectiveCamera
	protected renderingRequested = false
	protected controls: OrbitControls
	public readonly loadedModel: Promise<void>

	constructor(
		protected canvasElement: HTMLCanvasElement,
		modelData: IGeoSchema,
		protected texturePath: string,
		protected options: IOptions
	) {
		this.renderer = new WebGLRenderer({
			canvas: canvasElement,
			antialias: options.antialias ?? false,
		})
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.camera = new PerspectiveCamera(70, 2, 0.1, 1000)
		this.camera.position.x = -20
		this.camera.position.y = 20
		this.camera.position.z = -20

		this.camera.updateProjectionMatrix()
		this.controls = new OrbitControls(this.camera, canvasElement)
		this.scene = new Scene()
		this.scene.add(new AmbientLight(0xffffff))
		this.scene.background = new Color(0xcaf0f8)
		this.model = new Model(modelData, texturePath)
		this.scene.add(this.model.getGroup())

		window.addEventListener('resize', this.onResize.bind(this))
		this.controls.addEventListener('change', () => this.requestRendering())

		this.onResize()
		this.loadedModel = this.loadModel().then(() => this.requestRendering())
	}

	protected async loadModel() {
		await this.model.create()
	}

	protected get width() {
		return this.options.width ?? window.innerWidth
	}
	protected get height() {
		return this.options.height ?? window.innerHeight
	}

	protected render(checkShouldTick = true) {
		this.controls.update()
		this.renderer.render(this.scene, this.camera)
		this.renderingRequested = false

		if (checkShouldTick && this.model.shouldTick) {
			this.model.tick()
			this.model.animator.winterskyScene?.updateFacingRotation(
				this.camera
			)
			this.requestRendering()
		}
	}

	requestRendering(immediate = false) {
		if (immediate) return this.render(false)

		if (this.renderingRequested) return

		this.renderingRequested = true
		requestAnimationFrame(() => this.render())
	}
	protected onResize() {
		this.renderer.setSize(this.width, this.height, true)
		this.camera.aspect = this.width / this.height
		this.positionCamera()
		this.requestRendering()
	}
	dispose() {
		window.removeEventListener('resize', this.onResize)
		this.controls.removeEventListener('change', this.requestRendering)
	}

	addHelpers() {
		this.scene.add(new AxesHelper(50))
		this.scene.add(new GridHelper(20, 20))
		this.scene.add(new BoxHelper(this.model.getGroup(), 0xffff00))

		this.requestRendering()
	}
	getModel() {
		return this.model
	}

	// From: https://github.com/mrdoob/three.js/issues/6784#issuecomment-315963625
	positionCamera(scale = 1.5, rotate = true) {
		if (rotate) this.model.getGroup().rotation.set(0, Math.PI, 0)
		const boundingSphere = new Box3()
			.setFromObject(this.model.getGroup())
			.getBoundingSphere(new Sphere())

		const objectAngularSize = ((this.camera.fov * Math.PI) / 180) * scale
		const distanceToCamera =
			boundingSphere.radius / Math.tan(objectAngularSize / 2)
		const len = Math.sqrt(
			Math.pow(distanceToCamera, 2) + Math.pow(distanceToCamera, 2)
		)

		this.camera.position.set(len, len, len)
		this.controls.update()

		this.camera.lookAt(boundingSphere.center)
		this.controls.target.set(
			boundingSphere.center.x,
			boundingSphere.center.y,
			boundingSphere.center.z
		)

		this.camera.updateProjectionMatrix()
	}
}
