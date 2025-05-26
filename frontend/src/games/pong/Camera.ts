export class Camera {
    position: [number, number, number];
    rotation: [number, number, number];  // [pitch, yaw, roll]
    fov: number;
    aspect: number;

    constructor(position: [number, number, number] = [0, 2, 5], rotation: [number, number, number] = [0, 0, 0], fov = 90, aspect = 1) {
        this.position = position;
        this.rotation = rotation;
        this.fov = fov;
        this.aspect = aspect;
    }

    update(keys: { [key: string]: boolean }, moveSpeed = 0.1, rotateSpeed = 0.02): void {
        const forward = [
            -Math.cos(this.rotation[1] + Math.PI/2),   // yaw
            0,
            -Math.sin(this.rotation[1] + Math.PI/2),  // yaw
        ];
        const right = [
            Math.cos(this.rotation[1]),   // yaw
            0,
            Math.sin(this.rotation[1]),  // yaw
        ];

        // Update position
        if (keys['w']) {
            this.position[0] += forward[0] * moveSpeed;
            this.position[2] += forward[2] * moveSpeed;
        }
        if (keys['s']) {
            this.position[0] -= forward[0] * moveSpeed;
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
        if (keys['arrowright']) {
            this.rotation[1] += rotateSpeed;  // yaw
        }
        if (keys['arrowleft']) {
            this.rotation[1] -= rotateSpeed;  // yaw
        }
        if (keys['arrowdown']) {
            this.rotation[0] -= rotateSpeed;  // pitch
        }
        if (keys['arrowup']) {
            this.rotation[0] += rotateSpeed;  // pitch
        }
    }

    getRotationMatrix(): Float32Array {
        const pitch = this.rotation[0];  // X rotation (up/down)
        const yaw = this.rotation[1];    // Y rotation (left/right)
        
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);

        return new Float32Array([
            cosY, 0, -sinY,
            -sinY * sinP, cosP, -cosY * sinP,
            sinY * cosP, sinP, cosY * cosP
        ]);
    }
} 