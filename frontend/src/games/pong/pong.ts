import { Camera } from './Camera';
import { InputHandler } from './InputHandler';
import { Renderer } from './Renderer';
import { Scene } from './Scene';

export class PongGame {
    private canvas: HTMLCanvasElement;
    private renderer: Renderer;
    private scene: Scene;
    private inputHandler: InputHandler;
    private animationFrameId: number | null = null;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.scene = new Scene();
        this.renderer = new Renderer(this.canvas);
        this.inputHandler = new InputHandler();
    }

    async mount(element: HTMLElement): Promise<void> {
        element.appendChild(this.canvas);
        this.handleResize();
        window.addEventListener('resize', this.handleResize.bind(this));
        await this.renderer.initialize();
        this.gameLoop();
    }

    unmount(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        window.removeEventListener('resize', this.handleResize.bind(this));
        this.canvas.remove();
    }

    private handleResize(): void {
        const rect = this.canvas.parentElement?.getBoundingClientRect();
        if (rect) {
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.scene.camera.aspect = rect.width / rect.height;
        }
    }

    private gameLoop(): void {
        // Update camera based on input
        const moveSpeed = 0.1;
        const rotateSpeed = 0.02;
        this.scene.camera.update(this.inputHandler.getKeys(), moveSpeed, rotateSpeed);

        // Render the scene
        this.renderer.render(this.scene);

        // Continue the game loop
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
}
