import {
	DoubleSide,
	Group,
	MathUtils,
	MeshLambertMaterial,
	NearestFilter,
	Object3D,
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

	constructor(modelData: IGeoSchema, texturePath: string) {
		const id = modelData.description?.identifier ?? 'geometry.unknown'
		const textureSize: [number, number] = [
			modelData.description?.texture_width ?? 128,
			modelData.description?.texture_height ?? 128,
		]
		const boneParentMap = new Map<string, [string | undefined, Group]>()

		this.model = new Group()
		this.model.name = id

		const loader = new TextureLoader()
		const texture = loader.load(texturePath)
		texture.magFilter = NearestFilter
		texture.minFilter = NearestFilter
		const modelMaterial = new MeshLambertMaterial({
			side: DoubleSide,
			alphaTest: 0.2,
			transparent: true,
			map: texture,
		})

		modelData.bones?.forEach((boneData) => {
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
				locator.position.set(...locators[locatorName])
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

	dispose() {
		this.animator.dispose()
	}
}
