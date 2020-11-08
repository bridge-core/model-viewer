import {
	BufferAttribute,
	BufferGeometry,
	Group,
	Material,
	MathUtils,
	Mesh,
} from 'three'
import { CubeFaces } from './CubeFaces'
import { IPolyMesh, TVector } from './Schema/Model'

export interface IUVObj {
	north: IUVConfig
	south: IUVConfig
	east: IUVConfig
	west: IUVConfig
	up: IUVConfig
	down: IUVConfig
}

export interface IUVConfig {
	uv: [number, number]
	uv_size: [number, number]
}

export interface IPolyMeshConfig extends IPolyMesh {
	textureSize: [number, number]
	mirror: boolean
	material: Material
	origin: [number, number, number]
	pivot?: [number, number, number]
	rotation?: [number, number, number]
	inflate?: number
}

export class PolyMesh {
	protected positions: number[] = []
	protected indices: number[] = []
	protected normals: number[] = []
	protected uvs: number[] = []
	protected geometry = new BufferGeometry()
	protected group = new Group()

	constructor(polyMeshConfig: IPolyMeshConfig) {
		if (!Array.isArray(polyMeshConfig.polys))
			throw new Error('Format not supported yet!')
		if (!polyMeshConfig.normalized_uvs)
			polyMeshConfig.uvs = polyMeshConfig?.uvs?.map(([uvX, uvY]) => [
				uvX / polyMeshConfig.textureSize[0],
				uvY / polyMeshConfig.textureSize[1],
			])

		const positions: number[] = []
		const normals: number[] = []
		const uvs: number[] = []
		const indices: number[] = []

		let i = 0
		for (const face of polyMeshConfig.polys) {
			for (const [vertexIndex, normalIndex, uvIndex] of face) {
				positions.push(
					...(polyMeshConfig?.positions?.[vertexIndex] ?? [])
				)
				normals.push(...(polyMeshConfig?.normals?.[normalIndex] ?? []))
				uvs.push(...(polyMeshConfig?.uvs?.[uvIndex] ?? []))
			}

			if (face.length === 3) {
				indices.push(i, i + 1, i + 2)
			} else {
				indices.push(i + 2, i + 1, i, i + 2, i, i + 3)
			}

			i += face.length
		}

		this.createGeometry()
		this.createMesh(polyMeshConfig)
	}

	protected createGeometry() {
		this.geometry.setAttribute(
			'position',
			new BufferAttribute(new Float32Array(this.positions), 3)
		)
		this.geometry.setAttribute(
			'normal',
			new BufferAttribute(new Float32Array(this.normals), 3)
		)
		this.geometry.setAttribute(
			'uv',
			new BufferAttribute(new Float32Array(this.uvs), 2)
		)
		this.geometry.setIndex(this.indices)
	}

	protected createMesh({ material }: IPolyMeshConfig) {
		const mesh = new Mesh(this.geometry, material)
		this.group.add(mesh)
	}

	getGroup() {
		return this.group
	}
}
