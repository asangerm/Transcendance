import { Camera } from './Camera';
import { Scene, GameObject } from './Scene';
import { ShaderManager } from './ShaderManager';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram | null;
    private vertexBuffer: WebGLBuffer | null;
    private positionLocation: number;
    private scene: Scene;
    private initialized: boolean = false;
    private textDisplay: HTMLDivElement;
    private frameCount: number = 0;
    private lastTime: number = performance.now();
    private fps: number = 0;

    constructor(canvas: HTMLCanvasElement, textDisplay: HTMLDivElement) {
        this.canvas = canvas;
        const context = canvas.getContext('webgl2');
        if (!context) {
            throw new Error('WebGL2 not supported');
        }
        this.gl = context;
        this.program = null;
        this.vertexBuffer = null;
        this.positionLocation = -1;
        this.scene = new Scene();
        this.textDisplay = textDisplay;
        
        this.setupCanvas();
    }

    setupCanvas(): void {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    setupGeometry(): void {
        const gl = this.gl;
        
        // Create a fullscreen quad
        const vertices = new Float32Array([
            -1, -1,  // bottom left
             1, -1,  // bottom right
            -1,  1,  // top left
             1,  1   // top right
        ]);

        // Create and bind vertex buffer
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Get attribute location
        this.positionLocation = gl.getAttribLocation(this.program!, 'position');
    }

    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            this.program = await ShaderManager.createShaderProgram(this.gl);
            this.setupGeometry();
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing renderer:', error);
            throw error;
        }
    }

    private updateSceneUniforms(scene: Scene): void {
        const gl = this.gl;
        const camera = scene.camera;

        // Update camera uniforms
        gl.uniform3fv(gl.getUniformLocation(this.program!, 'uCameraPosition'), camera.position);
        
        // Create rotation matrix from camera rotation
        const [pitch, yaw] = camera.rotation;
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        
        const rotationMatrix = new Float32Array([
            cosY, 0, sinY,
            -sinY * sinP, cosP, cosY * sinP,
            -sinY * cosP, -sinP, cosY * cosP
        ]);
        gl.uniformMatrix3fv(gl.getUniformLocation(this.program!, 'uCameraRotation'), false, rotationMatrix);
        
        // Update screen size
        gl.uniform2f(gl.getUniformLocation(this.program!, 'uScreenSize'), this.canvas.width, this.canvas.height);

        // Update scene uniforms
        const objects = scene.getObjects();
        gl.uniform1i(gl.getUniformLocation(this.program!, 'uObjects'), objects.length);

        // Update object data
        objects.forEach((obj, i) => {
            gl.uniform1i(gl.getUniformLocation(this.program!, `uObjectTypes[${i}]`), obj.type);
            gl.uniform3fv(gl.getUniformLocation(this.program!, `uObjectPositions[${i}]`), obj.position);
            gl.uniform3fv(gl.getUniformLocation(this.program!, `uObjectSizes[${i}]`), obj.size);
            gl.uniform3fv(gl.getUniformLocation(this.program!, `uObjectColors[${i}]`), obj.material.color);
            gl.uniform3fv(gl.getUniformLocation(this.program!, `uObjectRotations[${i}]`), obj.rotation);
            gl.uniform1f(gl.getUniformLocation(this.program!, `uObjectRoughnesses[${i}]`), obj.material.roughness);
            gl.uniform1f(gl.getUniformLocation(this.program!, `uObjectTransparencies[${i}]`), obj.material.transparency);
            gl.uniform1f(gl.getUniformLocation(this.program!, `uObjectReflectivities[${i}]`), obj.material.reflectivity);
            gl.uniform1f(gl.getUniformLocation(this.program!, `uObjectRefractiveIndices[${i}]`), obj.material.refractiveIndex);
            gl.uniform3fv(gl.getUniformLocation(this.program!, `uLightColors[${i}]`), obj.lighting.color);
            gl.uniform1f(gl.getUniformLocation(this.program!, `uLightIntensities[${i}]`), obj.lighting.intensity);
        });

        // Update render settings
        const settings = scene.getRenderSettings();
        gl.uniform1i(gl.getUniformLocation(this.program!, 'uMaxBounces'), settings.maxBounces);
        gl.uniform1i(gl.getUniformLocation(this.program!, 'uSamplesPerPixel'), settings.samplesPerPixel);
        gl.uniform1f(gl.getUniformLocation(this.program!, 'uGamma'), settings.gamma);
        gl.uniform1f(gl.getUniformLocation(this.program!, 'uExposure'), settings.exposure);
    }

    render(scene: Scene): void {
        const gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program!);

        // Update uniforms with scene data
        this.updateSceneUniforms(scene);

        // Draw the fullscreen quad
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer!);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Update FPS counter
        this.frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;
        
        if (elapsed >= 1000) { // Update every second
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastTime = currentTime;
        }

        // Update text display with camera position and FPS
        const pos = scene.camera.position;
        this.textDisplay.textContent = `Camera: (${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)}) | FPS: ${this.fps}`;
    }
} 