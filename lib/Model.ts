import {
	BoxGeometry,
	DoubleSide,
	EdgesGeometry,
	Group,
	LineBasicMaterial,
	LineSegments,
	MathUtils,
	MeshLambertMaterial,
	NearestFilter,
	Texture,
	TextureLoader,
} from 'three'
import { Animator } from './Animations/Animator'
import { Cube } from './Cube'
import { PolyMesh } from './PolyMesh'
import { IGeoSchema } from './Schema/Model'

export class Model {
	protected model: Group
	protected boneMap = new Map<string, Group>()
	protected locators = new Map<string, Group>()
	public readonly animator = new Animator(this)

	constructor(
		protected modelData: IGeoSchema,
		protected texturePath: string
	) {
		const id = modelData?.description?.identifier ?? 'geometry.unknown'

		this.model = new Group()
		this.model.name = id
	}

	async create() {
		const modelData = this.modelData
		const texture = await this.loadTexture(this.texturePath)

		const textureSize: [number, number] = [
			modelData?.description?.texture_width ?? texture.image.width,
			modelData?.description?.texture_height ?? texture.image.height,
		]
		const textureDiscrepancyFactor: [number, number] = [
			texture.image.width / textureSize[0],
			texture.image.height / textureSize[1],
		]
		const boneParentMap = new Map<string, [string | undefined, Group]>()

		texture.magFilter = NearestFilter
		texture.minFilter = NearestFilter
		const modelMaterial = new MeshLambertMaterial({
			side: DoubleSide,
			alphaTest: 0.2,
			transparent: true,
			map: texture,
		})

		modelData?.bones?.forEach((boneData) => {
			const currBone = new Group()
			currBone.name = boneData.name ?? 'unknown'

			if (boneData.poly_mesh) {
				const polyMeshGroup = new PolyMesh({
					...boneData.poly_mesh,
					textureSize,
					material: modelMaterial,
					mirror: boneData.mirror ?? false,
					origin: [0, 0, 0],
					inflate: boneData.inflate,
					rotation: [0, 0, 0],
					pivot: boneData.pivot,
				}).getGroup()
				polyMeshGroup.name = `#bone.${boneData.name}#polyMesh`

				currBone.add(polyMeshGroup)
			}

			boneData.cubes?.forEach((cubeData, i) => {
				const group = new Cube({
					width: cubeData.size?.[0] ?? 0,
					height: cubeData.size?.[1] ?? 0,
					depth: cubeData.size?.[2] ?? 0,
					startUV: cubeData.uv,
					textureSize,
					textureDiscrepancyFactor,
					material: modelMaterial,
					mirror:
						cubeData.mirror === undefined &&
						cubeData.rotation === undefined //Only cubes without rotation inherit mirror arg from bone
							? boneData.mirror ?? false
							: cubeData.mirror ?? false,
					origin: cubeData.origin ?? [0, 0, 0],
					inflate: cubeData.inflate ?? boneData.inflate,
					rotation: cubeData.rotation,
					pivot: cubeData.pivot ?? boneData.pivot,
				}).getGroup()

				group.name = `#bone.${boneData.name}#cube.${i}`
				currBone.add(group)
			})

			const pivotGroup = new Group()
			pivotGroup.rotation.order = 'ZYX'
			if (boneData.pivot) {
				const [pX, pY, pZ] = boneData.pivot
				pivotGroup.position.set(-pX, pY, pZ)
				currBone.position.set(pX, -pY, -pZ)
			} else {
				pivotGroup.position.set(0, 0, 0)
			}

			pivotGroup.add(currBone)
			pivotGroup.name = `#pivot.${boneData.name}`

			// TODO: Seems to be a lot of work for rendering a few legacy entities
			// if (boneData.bind_pose_rotation) {
			//
			// }

			if (boneData.rotation) {
				const [rX, rY, rZ] = boneData.rotation

				pivotGroup.rotation.set(
					MathUtils.degToRad(-rX),
					MathUtils.degToRad(-rY),
					MathUtils.degToRad(rZ)
				)
			}

			const locators = boneData.locators ?? {}
			for (const locatorName in locators) {
				const locator = new Group()
				locator.name = `locator#${locatorName}`
				const locData = locators[locatorName]

				if (Array.isArray(locData)) {
					locator.position.set(...locData)
				} else if (typeof locData === 'object') {
					locator.position.set(...(locData.offset ?? [0, 0, 0]))
					locator.rotation.set(...(locData.rotation ?? [0, 0, 0]))
				}

				this.locators.set(locatorName, locator)
				pivotGroup.add(locator)
			}

			if (!boneData.parent) this.model.add(pivotGroup)
			if (boneData.name) {
				boneParentMap.set(boneData.name, [boneData.parent, pivotGroup])
				this.boneMap.set(boneData.name, pivotGroup)
			}
		})

		//Set bone parents
		for (let [_, [parent, bone]] of boneParentMap)
			if (parent) {
				const parentGroup = boneParentMap.get(parent)?.[1]
				if (parentGroup && parentGroup.name.startsWith('#pivot.'))
					parentGroup.children[0].add(bone)
				else if (parentGroup) parentGroup.add(bone)
			}

		this.animator.setupDefaultBonePoses()
	}

	getGroup() {
		return this.model
	}

	getBoneMap() {
		return this.boneMap
	}
	getLocator(name: string) {
		return this.locators.get(name)
	}

	tick() {
		this.animator.tick()
	}
	get shouldTick() {
		return this.animator.shouldTick
	}

	createOutlineBox(
		color: `#${string}`,
		position: { x: number; y: number; z: number },
		size: { x: number; y: number; z: number }
	) {
		const outlineMaterial = new LineBasicMaterial({
			side: DoubleSide,
			color: color,
			linewidth: 20,
		})
		const cube = new BoxGeometry(size.x, size.y, size.z)
		const edges = new EdgesGeometry(cube)

		const mesh = new LineSegments(edges, outlineMaterial)
		mesh.position.set(position.x, position.y + size.y / 2, position.z)
		mesh.name = 'helperBox'

		this.model.add(mesh)

		return {
			dispose: () => {
				this.model.remove(mesh)
			},
		}
	}

	hideBone(name: string) {
		const bone = this.boneMap.get(name)
		if (bone) bone.visible = false
	}
	showBone(name: string) {
		const bone = this.boneMap.get(name)
		if (bone) bone.visible = true
	}
	get bones() {
		return [...this.boneMap.keys()]
	}

	dispose() {
		this.animator.dispose()
	}

	protected loadTexture(url: string) {
		return new Promise<Texture>((resolve, reject) => {
			const loader = new TextureLoader()
			loader.load(url, (texture) => {
				resolve(texture)
			})
		})
	}
}
