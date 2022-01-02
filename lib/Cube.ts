import {
	BufferAttribute,
	BufferGeometry,
	Group,
	Material,
	MathUtils,
	Mesh,
} from 'three'
import { CubeFaces } from './CubeFaces'

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

export interface ICubeConfig {
	width: number
	height: number
	depth: number
	startUV?: [number, number] | IUVObj
	textureSize: [number, number]
	textureDiscrepancyFactor: [number, number]
	mirror: boolean
	material: Material
	origin: [number, number, number]
	pivot?: [number, number, number]
	rotation?: [number, number, number]
	inflate?: number
}
const ReduceUvConst = 0.03

export class Cube {
	protected positions: number[] = []
	protected indices: number[] = []
	protected normals: number[] = []
	protected uvs: number[] = []
	protected geometry = new BufferGeometry()
	protected group = new Group()

	constructor(cubeConfig: ICubeConfig) {
		const {
			textureSize: [tW, tH],
			textureDiscrepancyFactor: [
				textureDiscrepancyW,
				textureDiscrepancyH,
			],
			mirror,
			width,
			height,
			depth,
		} = cubeConfig
		const [realTextureW, realTextureH] = [
			tW * textureDiscrepancyW,
			tH * textureDiscrepancyH,
		]

		// The base UV provided by the model file for this cube
		const startUV = cubeConfig.startUV ?? [0, 0]
		const usesUVObj = !Array.isArray(startUV)
		let uvX: number = 0,
			uvY: number = 0
		if (!usesUVObj) [uvX, uvY] = startUV as [number, number]

		for (let {
			name,
			dir,
			corners,
			baseUV: [baseUVX, baseUVY],
		} of CubeFaces) {
			const ndx = this.positions.length / 3
			let uvSizeX, uvSizeY
			if (usesUVObj) {
				if ((startUV as IUVObj)[name] === undefined) continue
				;[uvX, uvY] = (startUV as IUVObj)[name]?.uv || []
				;[uvSizeX, uvSizeY] = (startUV as IUVObj)[name]?.uv_size || []

				uvSizeX *= textureDiscrepancyW
				uvSizeY *= textureDiscrepancyH
				uvX *= textureDiscrepancyW
				uvY *= textureDiscrepancyH

				baseUVX = 0
				baseUVY = 0
			}

			for (const {
				pos: [oX, oY, oZ],
				uv,
			} of corners) {
				this.positions.push(
					(mirror ? -oX : oX) * width,
					oY * height,
					oZ * depth
				)
				this.normals.push(...dir)

				this.uvs.push(
					//Base offset of the current cube
					(uvX +
						//Horizontal offset for the current face
						(Number(baseUVX > 0) + Number(baseUVX > 2)) *
							Math.floor(uvSizeX ?? depth) +
						Number(baseUVX > 1) * Math.floor(uvSizeX ?? width) +
						//Face corner specific offsets
						uv[0] *
							(name === 'west' || name === 'east'
								? Math.floor(uvSizeX ?? depth)
								: Math.floor(uvSizeX ?? width)) +
						(uv[0] === 0 ? ReduceUvConst : -ReduceUvConst)) /
						(realTextureW / (!usesUVObj ? textureDiscrepancyW : 1)),
					//Align uv to top left corner
					1 -
						//Base offset of the current cube
						(uvY +
							//Vertical offset for the current face
							baseUVY * Math.floor(uvSizeY ?? depth) +
							(name === 'up' || name === 'down'
								? Math.floor(uvSizeY ?? depth)
								: Math.floor(uvSizeY ?? height)) -
							//Face corner specific offsets
							uv[1] *
								(name === 'up' || name === 'down'
									? Math.floor(uvSizeY ?? depth)
									: Math.floor(uvSizeY ?? height)) +
							(uv[1] === 0 ? -ReduceUvConst : ReduceUvConst)) /
							(realTextureH /
								(!usesUVObj ? textureDiscrepancyH : 1))
				)
			}

			this.indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3)
		}

		this.createGeometry()
		this.createMesh(cubeConfig)
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

	protected createMesh({
		material,
		width,
		height,
		depth,
		pivot,
		rotation,
		origin,
		inflate = 0,
	}: ICubeConfig) {
		const calculatedWidth = inflate * 2 + width
		const mesh = new Mesh(this.geometry, material)

		this.group.rotation.order = 'ZYX'

		if (pivot === undefined)
			//Rotate around center of cube without pivot
			pivot = [calculatedWidth / 2, height / 2, depth / 2]

		this.group.add(mesh)

		if (rotation) {
			this.group.position.set(-pivot[0], pivot[1], pivot[2])
			mesh.position.set(
				-origin[0] - calculatedWidth / 2 + pivot[0] + inflate,
				origin[1] - pivot[1] - inflate,
				origin[2] - pivot[2] - inflate
			)

			const [rX, rY, rZ] = rotation
			this.group.rotation.set(
				MathUtils.degToRad(-rX),
				MathUtils.degToRad(-rY),
				MathUtils.degToRad(rZ)
			)
		} else {
			this.group.position.set(
				-origin[0] - calculatedWidth / 2 + inflate,
				origin[1] - inflate,
				origin[2] - inflate
			)
		}

		if (inflate)
			this.group.scale.set(
				width !== 0 ? 1 + inflate / (width / 2) : 1,
				height !== 0 ? 1 + inflate / (height / 2) : 1,
				depth !== 0 ? 1 + inflate / (depth / 2) : 1
			)
	}

	getGroup() {
		return this.group
	}
}
