import { Camera } from './Camera';

export interface GameObject {
    type: string;
    name: string;
    position: [number, number, number];
    size: [number, number, number];
    rotation: [number, number, number];
    material: {
        color: [number, number, number];
        roughness: number;
        reflectivity: number;
        transparency: number;
        refractiveIndex: number;
    };
    lighting: {
        color: [number, number, number];
        intensity: number;
    };
}

export class Scene {
    camera: Camera;
    objects: GameObject[];
    renderSettings: {
        maxBounces: number;
        samplesPerPixel: number;
        gamma: number;
        exposure: number;
    };

    constructor() {
        this.camera = new Camera();
        this.objects = [];
        this.renderSettings = {
            maxBounces: 5,
            samplesPerPixel: 16,
            gamma: 2.2,
            exposure: 1.0
        };
        this.loadScene();
    }

    private async loadScene(): Promise<void> {
        try {
            const response = await fetch('/src/games/pong/scenes/raytracerScene.json');
            if (!response.ok) {
                throw new Error(`Failed to load scene: ${response.statusText}`);
            }
            const data = await response.json();
            
            // Update camera settings
            if (data.camera) {
                this.camera.position = data.camera.position;
                this.camera.rotation = data.camera.rotation;
                this.camera.fov = data.camera.fov;
                this.camera.aspect = data.camera.aspect;
            }

            // Update objects
            if (data.objects) {
                this.objects = data.objects;
            }

            // Update render settings
            if (data.renderSettings) {
                this.renderSettings = {
                    ...this.renderSettings,
                    ...data.renderSettings
                };
            }

            console.log("loaded scene: ", {scene: data});
        } catch (error) {
            console.error('Error loading scene:', error);
        }
    }

    findObjectByIndex(index: number): GameObject | undefined {
        return this.objects[index];
    }

    updateObjectByIndex(index: number, updates: Partial<GameObject>): GameObject | undefined {
        const obj = this.findObjectByIndex(index);
        if (obj) {
            Object.assign(obj, updates);
        }
        return obj;
    }

    getObjects(): GameObject[] {
        return this.objects;
    }

    getRenderSettings() {
        return this.renderSettings;
    }
} 