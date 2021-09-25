import { BufferGeometry, Group, Material } from 'three';
export interface IUVObj {
    north: IUVConfig;
    south: IUVConfig;
    east: IUVConfig;
    west: IUVConfig;
    up: IUVConfig;
    down: IUVConfig;
}
export interface IUVConfig {
    uv: [number, number];
    uv_size: [number, number];
}
export interface ICubeConfig {
    width: number;
    height: number;
    depth: number;
    startUV?: [number, number] | IUVObj;
    textureSize: [number, number];
    textureDiscrepancyFactor: [number, number];
    mirror: boolean;
    material: Material;
    origin: [number, number, number];
    pivot?: [number, number, number];
    rotation?: [number, number, number];
    inflate?: number;
}
export declare class Cube {
    protected positions: number[];
    protected indices: number[];
    protected normals: number[];
    protected uvs: number[];
    protected geometry: BufferGeometry;
    protected group: Group;
    constructor(cubeConfig: ICubeConfig);
    protected createGeometry(): void;
    protected createMesh({ material, width, height, depth, pivot, rotation, origin, inflate, }: ICubeConfig): void;
    getGroup(): Group;
}
