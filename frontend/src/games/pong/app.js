class Camera {
    constructor(position = [0, 2, 5], rotation = [0, 0, 0], fov = 90, aspect = 1) {
        this.position = position;
        this.rotation = rotation;
        this.fov = fov;
        this.aspect = aspect;
    }

    update(keys, moveSpeed = 0.1, rotateSpeed = 0.02) {
        const forward = [
            -Math.sin(this.rotation[0]),
            0,
            -Math.cos(this.rotation[0])
        ];
        const right = [
            Math.sin(this.rotation[0] + Math.PI/2),
            0,
            Math.cos(this.rotation[0] + Math.PI/2)
        ];

        // Update position
        if (keys['w']) {
            this.position[0] += forward[0] * moveSpeed;
            this.position[1] += forward[1] * moveSpeed;
            this.position[2] += forward[2] * moveSpeed;
        }
        if (keys['s']) {
            this.position[0] -= forward[0] * moveSpeed;
            this.position[1] -= forward[1] * moveSpeed;
            this.position[2] -= forward[2] * moveSpeed;
        }
        if (keys['a']) {
            this.position[0] -= right[0] * moveSpeed;
            this.position[2] -= right[2] * moveSpeed;
        }
        if (keys['d']) {
            this.position[0] += right[0] * moveSpeed;
            this.position[2] += right[2] * moveSpeed;
        }
        if (keys[' ']) {
            this.position[1] += moveSpeed;
        }
        if (keys['shift']) {
            this.position[1] -= moveSpeed;
        }

        // Update rotation
        if (keys['arrowleft']) {
            this.rotation[0] += rotateSpeed;
        }
        if (keys['arrowright']) {
            this.rotation[0] -= rotateSpeed;
        }
        if (keys['arrowup']) {
            this.rotation[1] -= rotateSpeed;
        }
        if (keys['arrowdown']) {
            this.rotation[1] += rotateSpeed;
        }
    }

    getRotationMatrix() {
        // Extract Euler angles
        const yaw = this.rotation[0];    // Y rotation (left/right)
        const pitch = this.rotation[1];  // X rotation (up/down)
        
        // Pre-compute sin and cos
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);

        // Create rotation matrix for yaw (Y) and pitch (X)
        // First rotate around Y (yaw), then around X (pitch)
        // This gives us a proper "look around" camera with no roll
        return new Float32Array([
            cosY, 0, -sinY,
            -sinY * sinP, cosP, -cosY * sinP,  // Negated pitch terms
            sinY * cosP, sinP, cosY * cosP     // Negated pitch terms
        ]);
    }
}

class Scene {
    constructor() {
        this.camera = new Camera();
        this.objects = [];
        this.environment = {
            color: [0.5, 0.5, 0.5],
            intensity: 0.5
        };
        this.renderSettings = {
            maxBounces: 5,
            samplesPerPixel: 16,
            denoise: true,
            gamma: 2.2,
            exposure: 1.0
        };
    }

    async loadFromJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to load scene file');
            }
            const data = await response.json();
            
            // Update camera
            this.camera.position = data.camera.position;
            this.camera.rotation = data.camera.rotation;
            this.camera.fov = data.camera.fov;
            this.camera.aspect = data.camera.aspect;
            
            // Update objects
            this.objects = data.objects;
            
            // Update render settings
            if (data.renderSettings) {
                this.renderSettings = {
                    ...this.renderSettings,
                    ...data.renderSettings
                };
            }
            
            return true;
        } catch (error) {
            console.error('Error loading scene:', error);
            return false;
        }
    }

    findObjectByIndex(index) {
        return this.objects[index];
    }

    updateObjectByIndex(index, updates) {
        const obj = this.findObjectByIndex(index);
        if (obj) {
            Object.assign(obj, updates);
        }
        return obj;
    }
}

class InputHandler {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });
    }
}

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2');
        
        if (!this.gl) {
            throw new Error('WebGL2 not supported');
        }

        this.program = null;
        this.setupCanvas();
    }

    setupCanvas() {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    setupGeometry() {
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
        this.positionLocation = gl.getAttribLocation(this.program, 'position');
    }

    async loadShaders() {
        try {
            const vertexResponse = await fetch('/shaders/raytracer.vert');
            const fragmentResponse = await fetch('/shaders/raytracer.frag');
            
            if (!vertexResponse.ok || !fragmentResponse.ok) {
                throw new Error('Failed to load shader files');
            }
            
            const vertexShader = await vertexResponse.text();
            const fragmentShader = await fragmentResponse.text();

            this.program = this.createShaderProgram(vertexShader, fragmentShader);
            
            // Setup geometry after program is created
            this.setupGeometry();
            
            return this.program;
        } catch (error) {
            console.error('Error loading shaders:', error);
            throw error;
        }
    }

    createShaderProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        
        // Create and compile vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(vertexShader);
            throw new Error('Vertex shader compilation failed: ' + error);
        }

        // Create and compile fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(fragmentShader);
            throw new Error('Fragment shader compilation failed: ' + error);
        }

        // Create and link program
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            throw new Error('Program linking failed: ' + error);
        }

        return program;
    }

    render(scene) {
        if (!this.program) return;

        const gl = this.gl;
        gl.useProgram(this.program);

        // Update camera uniforms
        const cameraPosLocation = gl.getUniformLocation(this.program, 'uCameraPosition');
        gl.uniform3fv(cameraPosLocation, scene.camera.position);

        const screenSizeLocation = gl.getUniformLocation(this.program, 'uScreenSize');
        gl.uniform2f(screenSizeLocation, this.canvas.width, this.canvas.height);

        // Send camera rotation matrix
        const rotationMatrix = scene.camera.getRotationMatrix();
        const rotationMatrixLocation = gl.getUniformLocation(this.program, 'uCameraRotation');
        gl.uniformMatrix3fv(rotationMatrixLocation, false, rotationMatrix);

        // Update scene object uniforms
        const numObjects = scene.objects.length;
        gl.uniform1i(gl.getUniformLocation(this.program, 'uObjects'), numObjects);

        if (numObjects > 0) {
            // Create arrays for object properties
            const types = new Int32Array(numObjects);
            const positions = new Float32Array(numObjects * 3);
            const sizes = new Float32Array(numObjects * 3);
            const colors = new Float32Array(numObjects * 3);
            const roughnesses = new Float32Array(numObjects);
            const transparencies = new Float32Array(numObjects);
            const reflectivities = new Float32Array(numObjects);
            const refractiveIndices = new Float32Array(numObjects);
            const lightColors = new Float32Array(numObjects * 3);
            const lightIntensities = new Float32Array(numObjects);
            const rotations = new Float32Array(numObjects * 3);
            // Fill arrays with object data
            for (let i = 0; i < numObjects; i++) {
                const obj = scene.objects[i];
                types[i] = obj.type; // 0 for sphere, 1 for plane

                // Position
                positions[i * 3] = obj.position[0];
                positions[i * 3 + 1] = obj.position[1];
                positions[i * 3 + 2] = obj.position[2];

                // Size (radius for spheres, dimensions for planes)
                sizes[i * 3] = obj.size[0];
                sizes[i * 3 + 1] = obj.size[1];
                sizes[i * 3 + 2] = obj.size[2];

                // Rotation
                rotations[i * 3] = obj.rotation[0];
                rotations[i * 3 + 1] = obj.rotation[1];
                rotations[i * 3 + 2] = obj.rotation[2];

                // Material properties
                colors[i * 3] = obj.material.color[0];
                colors[i * 3 + 1] = obj.material.color[1];
                colors[i * 3 + 2] = obj.material.color[2];
                roughnesses[i] = obj.material.roughness;
                transparencies[i] = obj.material.transparency;
                reflectivities[i] = obj.material.reflectivity;
                refractiveIndices[i] = obj.material.refractiveIndex;

                // Light properties
                lightColors[i * 3] = obj.lighting.color[0];
                lightColors[i * 3 + 1] = obj.lighting.color[1];
                lightColors[i * 3 + 2] = obj.lighting.color[2];
                lightIntensities[i] = obj.lighting.intensity;
            }

            // Set uniform arrays
            gl.uniform1iv(gl.getUniformLocation(this.program, 'uObjectTypes'), types);
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uObjectPositions'), positions);
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uObjectSizes'), sizes);
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uObjectRotations'), rotations);
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uObjectColors'), colors);
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uObjectRoughnesses'), roughnesses);
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uObjectTransparencies'), transparencies);
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uObjectReflectivities'), reflectivities);
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uObjectRefractiveIndices'), refractiveIndices);
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uLightColors'), lightColors);
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uLightIntensities'), lightIntensities);
        } else {
            // Set empty arrays for uniforms when there are no objects
            gl.uniform1iv(gl.getUniformLocation(this.program, 'uObjectTypes'), new Int32Array(0));
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uObjectPositions'), new Float32Array(0));
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uObjectSizes'), new Float32Array(0));
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uObjectRotations'), new Float32Array(0));
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uObjectColors'), new Float32Array(0));
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uObjectRoughnesses'), new Float32Array(0));
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uObjectTransparencies'), new Float32Array(0));
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uObjectReflectivities'), new Float32Array(0));
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uObjectRefractiveIndices'), new Float32Array(0));
            gl.uniform3fv(gl.getUniformLocation(this.program, 'uLightColors'), new Float32Array(0));
            gl.uniform1fv(gl.getUniformLocation(this.program, 'uLightIntensities'), new Float32Array(0));
        }

        // Draw the fullscreen quad
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

// Main application
class RayTracerApp {
    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.scene = new Scene();
        this.renderer = new Renderer(this.canvas);
        this.inputHandler = new InputHandler();
        
        this.setupEventListeners();
        this.init();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.renderer.setupCanvas();
            this.scene.camera.aspect = this.canvas.width / this.canvas.height;
        });
    }

    async init() {
        try {
            await this.renderer.loadShaders();
            await this.scene.loadFromJSON('/games/pong/scenes/raytracerScene.json');
            this.animate();
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }

    animate() {
        this.scene.camera.update(this.inputHandler.keys);
        this.renderer.render(this.scene);
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the application when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    new RayTracerApp();
}); 