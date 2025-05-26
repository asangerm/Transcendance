export class ShaderManager {
    static async createShaderProgram(gl: WebGL2RenderingContext): Promise<WebGLProgram> {
        try {
            // Load shader files
            const vertexResponse = await fetch('/src/games/pong/shaders/raytracer.vert');
            const fragmentResponse = await fetch('/src/games/pong/shaders/raytracer.frag');
            
            if (!vertexResponse.ok || !fragmentResponse.ok) {
                throw new Error('Failed to load shader files');
            }
            
            const vertexSource = await vertexResponse.text();
            const fragmentSource = await fragmentResponse.text();

            // Create and compile vertex shader
            const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
            gl.shaderSource(vertexShader, vertexSource);
            gl.compileShader(vertexShader);

            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                const error = gl.getShaderInfoLog(vertexShader);
                gl.deleteShader(vertexShader);
                throw new Error(`Vertex shader compilation failed: ${error}`);
            }

            // Create and compile fragment shader
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
            gl.shaderSource(fragmentShader, fragmentSource);
            gl.compileShader(fragmentShader);

            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                const error = gl.getShaderInfoLog(fragmentShader);
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                throw new Error(`Fragment shader compilation failed: ${error}`);
            }

            // Create and link program
            const program = gl.createProgram()!;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                const error = gl.getProgramInfoLog(program);
                gl.deleteProgram(program);
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                throw new Error(`Shader program linking failed: ${error}`);
            }

            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);

            return program;
        } catch (error) {
            console.error('Error creating shader program:', error);
            throw error;
        }
    }
} 