import { BufferGeometry, Group, Material } from 'three';
import { IPolyMesh } from './Schema/Model';
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
export interface IPolyMeshConfig extends IPolyMesh {
    textureSize: [number, number];
    mirror: boolean;
    material: Material;
    origin: [number, number, number];
    pivot?: [number, number, number];
    rotation?: [number, number, number];
    inflate?: number;
}
export declare class PolyMesh {
    protected positions: number[];
    protected indices: number[];
    protected normals: number[];
    protected uvs: number[];
    protected geometry: BufferGeometry;
    protected group: Group;
    constructor(polyMeshConfig: IPolyMeshConfig);
    protected createGeometry(): void;
    protected createMesh({ material }: IPolyMeshConfig): void;
    getGroup(): Group;
}
