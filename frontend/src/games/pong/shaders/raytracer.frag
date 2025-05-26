#version 300 es
precision highp float;

// Golf Ball Ray Intersection GLSL Shader Functions
// For use in fragment shaders or compute shaders

uniform vec3 uCameraPosition;
uniform vec2 uScreenSize;
uniform mat3 uCameraRotation;

uniform int uObjects;
uniform int uObjectTypes[64];
uniform vec3 uObjectPositions[64];
uniform vec3 uObjectRotations[64];
uniform vec3 uObjectSizes[64];
uniform vec3 uObjectColors[64];
uniform float uObjectRoughnesses[64];
uniform float uObjectTransparencies[64];
uniform float uObjectReflectivities[64];
uniform float uObjectRefractiveIndices[64];
uniform vec3 uLightColors[64];
uniform float uLightIntensities[64];

in vec2 vUv;
out vec4 fragColor;

// Structure to hold intersection result
struct IntersectionResult {
    bool hit;
    float distance;
    vec3 point;
    vec3 color;
    vec3 normal;
    bool isEntry;
    float reflectivity;
    float roughness;
    float transparency;
    float refractiveIndex;
};

// Simple sphere surface equation
float sphereSurface(vec3 p, float radius) {
    return length(p) - radius;
}

// Calculate normal using finite differences
vec3 calculateNormal(vec3 p, float radius) {
    const float eps = 0.001;
    vec3 n = vec3(
        sphereSurface(p + vec3(eps, 0, 0), radius) - sphereSurface(p - vec3(eps, 0, 0), radius),
        sphereSurface(p + vec3(0, eps, 0), radius) - sphereSurface(p - vec3(0, eps, 0), radius),
        sphereSurface(p + vec3(0, 0, eps), radius) - sphereSurface(p - vec3(0, 0, eps), radius)
    );
    return normalize(n);
}

// Helper function to create rotation matrix from Euler angles
mat3 createRotationMatrix(vec3 eulerAngles) {
    float cx = cos(eulerAngles.x);
    float sx = sin(eulerAngles.x);
    float cy = cos(eulerAngles.y);
    float sy = sin(eulerAngles.y);
    float cz = cos(eulerAngles.z);
    float sz = sin(eulerAngles.z);

    mat3 rotX = mat3(
        1.0, 0.0, 0.0,
        0.0, cx, -sx,
        0.0, sx, cx
    );

    mat3 rotY = mat3(
        cy, 0.0, sy,
        0.0, 1.0, 0.0,
        -sy, 0.0, cy
    );

    mat3 rotZ = mat3(
        cz, -sz, 0.0,
        sz, cz, 0.0,
        0.0, 0.0, 1.0
    );

    return rotZ * rotY * rotX;
}

IntersectionResult intersectShape(vec3 rayOrigin, vec3 rayDirection, int objectIndex) {
    IntersectionResult result;
    result.hit = false;
    result.distance = -1.0;
    result.point = vec3(0.0);
    result.normal = vec3(0.0);
    result.color = uObjectColors[objectIndex];
    result.reflectivity = uObjectReflectivities[objectIndex];
    result.roughness = uObjectRoughnesses[objectIndex];
    result.transparency = uObjectTransparencies[objectIndex];
    result.refractiveIndex = uObjectRefractiveIndices[objectIndex];
    result.isEntry = false;
    
    vec3 center = uObjectPositions[objectIndex];
    float radius = uObjectSizes[objectIndex].x;
    
    // Transform ray to object space
    mat3 rotationMatrix = createRotationMatrix(uObjectRotations[objectIndex]);
    mat3 invRotationMatrix = transpose(rotationMatrix); // Inverse of rotation matrix is its transpose
    
    vec3 localRayOrigin = invRotationMatrix * (rayOrigin - center);
    vec3 localRayDir = invRotationMatrix * rayDirection;
    
    // Perform intersection in object space
    vec3 oc = localRayOrigin;
    float a = dot(localRayDir, localRayDir);
    float b = 2.0 * dot(oc, localRayDir);
    float c = dot(oc, oc) - radius * radius;
    
    float discriminant = b * b - 4.0 * a * c;
    if (discriminant < 0.0) {
        return result;
    }
    
    float sqrtDiscriminant = sqrt(discriminant);
    float t1 = (-b - sqrtDiscriminant) / (2.0 * a);
    float t2 = (-b + sqrtDiscriminant) / (2.0 * a);
    
    float startT = (t1 > 0.0) ? max(t1 - 0.02, 0.0) : t2 - 0.02;
    if (startT < 0.0) return result;
    
    // Raymarch to find precise intersection
    float t = startT;
    const int maxSteps = 64;
    const float minDist = 0.0001;
    
    for (int i = 0; i < maxSteps; i++) {
        vec3 currentPos = localRayOrigin + localRayDir * t;
        float dist = sphereSurface(currentPos, radius);
        
        if (dist < minDist) {
            // Transform back to world space
            vec3 worldPoint = rotationMatrix * currentPos + center;
            vec3 worldNormal = normalize(rotationMatrix * calculateNormal(currentPos, radius));
            
            result.hit = true;
            result.distance = t;
            result.point = worldPoint;
            result.normal = worldNormal;
            result.isEntry = true;
            return result;
        }
        
        if (dist > radius * 2.0 || t > 100.0) {
            break;
        }
        
        t += max(dist * 0.8, 0.001);
    }
    
    return result;
}

vec3 getSkyColor(vec3 rayDirection) {
    float t = rayDirection.y * 0.5 + 0.5;
    return mix(vec3(0.0, 0.0, 0.1), vec3(0.2, 0.2, 0.8), t);
}

IntersectionResult intersectPlane(vec3 rayOrigin, vec3 rayDirection, int objectIndex) {
    IntersectionResult result;
    result.hit = false;
    result.distance = -1.0;
    result.point = vec3(0.0);
    result.normal = vec3(0.0);
    result.color = uObjectColors[objectIndex];
    result.reflectivity = uObjectReflectivities[objectIndex];
    result.roughness = uObjectRoughnesses[objectIndex];
    result.transparency = uObjectTransparencies[objectIndex];
    result.refractiveIndex = uObjectRefractiveIndices[objectIndex];
    result.isEntry = false;

    vec3 point = uObjectPositions[objectIndex];
    vec3 normal = vec3(0.0, 1.0, 0.0); // Assuming y-up for planes
    vec3 size = uObjectSizes[objectIndex];

    // Calculate the denominator (dot product of ray direction and plane normal)
    float denom = dot(rayDirection, normal);
    
    // If the ray is parallel to the plane, there's no intersection
    if (abs(denom) < 0.0001) {
        return result;
    }
    
    // Calculate the distance to the plane
    float t = dot(point - rayOrigin, normal) / denom;
    
    // If the intersection is behind the ray origin, there's no intersection
    if (t < 0.0001) {
        return result;
    }
    
    // Calculate the intersection point
    vec3 hitPoint = rayOrigin + rayDirection * t;
    
    // Check if the hit point is within the plane's bounds
    if (abs(hitPoint.x - point.x) > size.x/2.0 || 
        abs(hitPoint.z - point.z) > size.z/2.0) {
        return result;
    }
    
    result.hit = true;
    result.distance = t;
    result.point = hitPoint;
    result.normal = normal;
    result.isEntry = denom < 0.0; // If ray is moving towards plane, it's an entry
    
    return result;
}

IntersectionResult intersectBox(vec3 rayOrigin, vec3 rayDirection, int objectIndex) {
    IntersectionResult result;
    result.hit = false;
    result.distance = -1.0;
    result.point = vec3(0.0);
    result.normal = vec3(0.0);
    result.color = uObjectColors[objectIndex];
    result.reflectivity = uObjectReflectivities[objectIndex];
    result.roughness = uObjectRoughnesses[objectIndex];
    result.transparency = uObjectTransparencies[objectIndex];
    result.refractiveIndex = uObjectRefractiveIndices[objectIndex];
    result.isEntry = false;

    vec3 boxCenter = uObjectPositions[objectIndex];
    vec3 boxSize = uObjectSizes[objectIndex];
    
    // Transform ray to object space
    mat3 rotationMatrix = createRotationMatrix(uObjectRotations[objectIndex]);
    mat3 invRotationMatrix = transpose(rotationMatrix);
    
    vec3 localRayOrigin = invRotationMatrix * (rayOrigin - boxCenter);
    vec3 localRayDir = invRotationMatrix * rayDirection;
    
    // Calculate box bounds in object space
    vec3 boxMin = -boxSize * 0.5;
    vec3 boxMax = boxSize * 0.5;
    
    // Calculate intersection with box planes
    vec3 invDir = 1.0 / localRayDir;
    vec3 tMin = (boxMin - localRayOrigin) * invDir;
    vec3 tMax = (boxMax - localRayOrigin) * invDir;
    
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    
    if (tNear > tFar || tFar < 0.0) {
        return result;
    }
    
    float t = tNear;
    if (t < 0.0) {
        t = tFar;
        if (t < 0.0) {
            return result;
        }
    }
    
    // Calculate intersection point in object space
    vec3 localHitPoint = localRayOrigin + localRayDir * t;
    
    // Calculate normal in object space
    vec3 localNormal;
    const float epsilon = 0.0001;
    
    float dx = abs(abs(localHitPoint.x) - boxSize.x * 0.5);
    float dy = abs(abs(localHitPoint.y) - boxSize.y * 0.5);
    float dz = abs(abs(localHitPoint.z) - boxSize.z * 0.5);
    
    if (dx < epsilon && dx < dy && dx < dz) {
        localNormal = vec3(sign(localHitPoint.x), 0.0, 0.0);
    } else if (dy < epsilon && dy < dx && dy < dz) {
        localNormal = vec3(0.0, sign(localHitPoint.y), 0.0);
    } else {
        localNormal = vec3(0.0, 0.0, sign(localHitPoint.z));
    }
    
    // Transform back to world space
    vec3 worldPoint = rotationMatrix * localHitPoint + boxCenter;
    vec3 worldNormal = normalize(rotationMatrix * localNormal);
    
    // Ensure normal points outward
    if (dot(rayDirection, worldNormal) > 0.0) {
        worldNormal = -worldNormal;
    }
    
    result.hit = true;
    result.distance = t;
    result.point = worldPoint;
    result.normal = worldNormal;
    result.isEntry = dot(rayDirection, worldNormal) < 0.0;
    
    return result;
}

IntersectionResult intersectScene(vec3 rayOrigin, vec3 rayDirection) {
    IntersectionResult result;
    result.hit = false;
    result.distance = -1.0;
    result.point = vec3(0.0);
    result.normal = vec3(0.0);
    result.color = vec3(0.0);
    result.reflectivity = 0.0;
    result.roughness = 0.0;
    result.transparency = 0.0;
    result.refractiveIndex = 1.0;
    result.isEntry = false;

    // Check all objects and keep the closest intersection
    for (int i = 0; i < uObjects; i++) {
        IntersectionResult currentResult;
        
        if (uObjectTypes[i] == 0) { // Sphere
            currentResult = intersectShape(rayOrigin, rayDirection, i);
        } else if (uObjectTypes[i] == 1) { // Plane
            currentResult = intersectBox(rayOrigin, rayDirection, i);
        } else if (uObjectTypes[i] == 2) { // Box
            currentResult = intersectPlane(rayOrigin, rayDirection, i);
        }
        
        if (currentResult.hit && (!result.hit || currentResult.distance < result.distance)) {
            result = currentResult;
        }
    }

    return result;
}

// Example usage in your fragment shader:
void main() {
    vec2 pixelCoord = gl_FragCoord.xy;
    vec2 ndc = (pixelCoord / uScreenSize) * 2.0 - 1.0;
    ndc.x *= uScreenSize.x / uScreenSize.y;
    
    vec3 rayDir = normalize(vec3(ndc, -1.0));
    rayDir = uCameraRotation * rayDir;
    
    vec3 color = vec3(0.0);
    vec3 rayOrigin = uCameraPosition;
    float rayEnergy = 1.0;
    
    int i = 0;
    for (; i < 50 && rayEnergy > 0.01; i++) {
        IntersectionResult result = intersectScene(rayOrigin, rayDir);
        if (result.hit) {
            rayOrigin = result.point + result.normal * 0.01;
            rayDir = reflect(rayDir, result.normal);
            color += result.color * (1.0 + result.roughness) * (1.0 - result.transparency) * rayEnergy;
            rayEnergy *= result.reflectivity;
        } else {
            color += getSkyColor(rayDir);
            i++;
            break;
        }
    }

    // fragColor = vec4(rayDir, 1.0);

    if (i == 0) {
        fragColor = vec4(getSkyColor(rayDir), 1.0);
    } else {
        fragColor = vec4(color / float(i), 1.0);
    }
}