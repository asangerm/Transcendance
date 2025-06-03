#version 300 es
precision highp float;

#define SAMPLE_POINTS 4
#define MAX_LIGHT_RAYS 64 * SAMPLE_POINTS

#define GI_ENABLED false

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
    vec3 normal;
    bool isEntry;
    int objectIndex;
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
    result.objectIndex = objectIndex;
    result.isEntry = false;
    
    vec3 center = uObjectPositions[objectIndex];
    float radius = uObjectSizes[objectIndex].x;
    
    // Transform ray to object space
    mat3 rotationMatrix = createRotationMatrix(uObjectRotations[objectIndex]);
    mat3 invRotationMatrix = transpose(rotationMatrix);
    
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
    
    // Accept both front and back face intersections
    float t = (t1 > 0.0) ? t1 : t2;
    if (t < 0.0) return result;
    
    // Raymarch to find precise intersection
    const int maxSteps = 64;
    const float minDist = 0.0001;
    
    for (int i = 0; i < maxSteps; i++) {
        vec3 currentPos = localRayOrigin + localRayDir * t;
        float dist = sphereSurface(currentPos, radius);
        
        if (dist < minDist) {
            // Transform back to world space
            vec3 worldPoint = rotationMatrix * currentPos + center;
            vec3 worldNormal = normalize(rotationMatrix * calculateNormal(currentPos, radius));
            
            // Ensure normal points against the ray direction
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

IntersectionResult intersectBox(vec3 rayOrigin, vec3 rayDirection, int objectIndex) {
    IntersectionResult result;
    result.hit = false;
    result.distance = -1.0;
    result.point = vec3(0.0);
    result.normal = vec3(0.0);
    result.objectIndex = objectIndex;
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
    
    // Check if there's a valid intersection
    if (tNear > tFar || tFar < 0.0) {
        return result;
    }
    
    float t = tNear;
    const float EPSILON = 0.01;
    if (t < EPSILON) {
        // If ray starts inside the box, allow intersection at tFar
        if (tFar > EPSILON) {
            t = tFar;
        } else {
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
    
    // Ensure normal points against the ray direction
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

IntersectionResult intersectScene(vec3 rayOrigin, vec3 rayDirection, int excludeObjectIndex) {
    IntersectionResult result;
    result.hit = false;
    result.distance = 1000000.0;
    result.point = vec3(0.0);
    result.normal = vec3(0.0);
    result.objectIndex = -1;
    result.isEntry = false;

    // Check all objects and keep the closest intersection
    for (int i = 0; i < uObjects; i++) {
        if (i == excludeObjectIndex) {
            continue;
        }

        // if (uLightIntensities[i] > 0.001) {
        //     continue;
        // }

        IntersectionResult currentResult;
        
        if (uObjectTypes[i] == 0) { // Sphere
            currentResult = intersectShape(rayOrigin, rayDirection, i);
        } else if (uObjectTypes[i] == 1) { // Box
            currentResult = intersectBox(rayOrigin, rayDirection, i);
        }
        
        if (currentResult.hit && (!result.hit || currentResult.distance < result.distance)) {
            result = currentResult;
        }
    }

    return result;
}

vec3[4] getSamplePoints(int objectIndex) {
    vec3 samplePoints[4];

    if (uObjectTypes[objectIndex] == 1) {
        vec3 sphereCenter = uObjectPositions[objectIndex];
        float sphereRadius = uObjectSizes[objectIndex].x;

        // Use fewer, more strategically placed sample points
        samplePoints[0] = sphereCenter + vec3(0.0, sphereRadius * 0.9, 0.0);
        samplePoints[1] = sphereCenter + vec3(sphereRadius * 0.9, 0.0, 0.0);
        samplePoints[2] = sphereCenter + vec3(0.0, 0.0, sphereRadius * 0.9);
        samplePoints[3] = sphereCenter + vec3(-sphereRadius * 0.7, -sphereRadius * 0.7, -sphereRadius * 0.7);

        return samplePoints;
    } else {
        vec3 boxSize = uObjectSizes[objectIndex];
        vec3 boxCenter = uObjectPositions[objectIndex];
        mat3 rotationMatrix = createRotationMatrix(uObjectRotations[objectIndex]);

        // Use fewer, more strategically placed sample points for boxes
        samplePoints[0] = rotationMatrix * (boxCenter + vec3(-boxSize.x * 0.5, -boxSize.y * 0.5, -boxSize.z * 0.5));
        samplePoints[1] = rotationMatrix * (boxCenter + vec3(boxSize.x * 0.5, boxSize.y * 0.5, boxSize.z * 0.5));
        samplePoints[2] = rotationMatrix * (boxCenter + vec3(-boxSize.x * 0.5, boxSize.y * 0.5, -boxSize.z * 0.5));
        samplePoints[3] = rotationMatrix * (boxCenter + vec3(boxSize.x * 0.5, -boxSize.y * 0.5, boxSize.z * 0.5));

        return samplePoints;
    }
}

vec3 calculateLighting(vec3 point, vec3 normal, vec3 viewDir, int objectIndex) {
    // Early exit for light sources
    if (uLightIntensities[objectIndex] > 0.0) {
        return uLightColors[objectIndex] * uLightIntensities[objectIndex] * 0.9;
    }

    vec3 color = uObjectColors[objectIndex];
    vec3 direct = vec3(0.0);
    float normalDotView = dot(normal, viewDir);
    
    // Add sky lighting (ambient)
    vec3 skyLight = getSkyColor(normal) * 0.2; // Scale down sky contribution
    direct += skyLight;
    
    // Cache frequently used calculations
    vec3 pointOffset = point + normal * 0.01;
    
    // Check all other objects
    for (int i = 0; i < uObjects; i++) {
        if (i == objectIndex) continue;

        // Early exit if object is not a light source and GI is disabled
        if (!GI_ENABLED && uLightIntensities[i] <= 0.001) continue;

        vec3[4] samplePoints = getSamplePoints(i);
        vec3 surfaceDirect = vec3(0.0);

        for (int j = 0; j < 4; j++) {
            vec3 samplePoint = samplePoints[j];
            vec3 rayDir = normalize(samplePoint - point);
            float normalDotRay = 1.0;//dot(rayDir, normal);
            
            // Skip if ray is pointing away from surface
            if (normalDotRay <= 0.0) continue;

            IntersectionResult result = intersectScene(pointOffset, rayDir, -1);
            if (result.objectIndex == -1 || result.objectIndex == objectIndex) {
                // Add sky contribution when ray hits nothing
                float skyFactor = max(0.0, normalDotRay);
                surfaceDirect += getSkyColor(rayDir) * skyFactor * 0.1; // Scale down secondary sky contribution
                continue;
            }

            float dist = length(result.point - point);
            float distSquared = dist * dist;
            
            // Skip if too far away
            if (distSquared > 100.0) continue;

            if (uLightIntensities[result.objectIndex] > 0.001) {
                float factor = normalDotRay * normalDotView;
                direct += uLightColors[result.objectIndex] * uLightIntensities[result.objectIndex] * factor / distSquared;
                continue;
            }

            if (!GI_ENABLED) continue;

            // Secondary bounce lighting
            vec3 secondaryPointOffset = result.point + result.normal * 0.01;
            float secondaryNormalDotRay = dot(rayDir, result.normal);

            for (int k = 0; k < uObjects; k++) {
                if (k == i || k == result.objectIndex || uLightIntensities[k] <= 0.001) continue;

                vec3[4] secondarySamplePoints = getSamplePoints(k);

                for (int l = 0; l < 4; l++) {
                    vec3 secondarySamplePoint = secondarySamplePoints[l];
                    vec3 secondaryRayDir = normalize(secondarySamplePoint - result.point);
                    
                    // Skip if ray is pointing away from surface
                    if (dot(secondaryRayDir, result.normal) <= 0.0) continue;

                    IntersectionResult secondaryResult = intersectScene(secondaryPointOffset, secondaryRayDir, -1);
                    if (secondaryResult.objectIndex == -1 || secondaryResult.objectIndex == result.objectIndex) {
                        // Add sky contribution for secondary rays
                        float skyFactor = max(0.0, dot(secondaryRayDir, result.normal));
                        surfaceDirect += getSkyColor(secondaryRayDir) * skyFactor * 0.05; // Scale down tertiary sky contribution
                        continue;
                    }

                    if (uLightIntensities[secondaryResult.objectIndex] > 0.001) {
                        float secondaryDist = length(secondaryResult.point - result.point);
                        float secondaryDistSquared = secondaryDist * secondaryDist;
                        
                        // Skip if too far away
                        if (secondaryDistSquared > 100.0) continue;

                        float factor = secondaryNormalDotRay * normalDotView;
                        surfaceDirect += uLightColors[secondaryResult.objectIndex] * 
                                       uLightIntensities[secondaryResult.objectIndex] * 
                                       factor / secondaryDistSquared;
                    }
                }
            }

            float factor = normalDotRay * normalDotView;
            direct += surfaceDirect * uObjectColors[result.objectIndex] * 
                     uObjectReflectivities[result.objectIndex] * factor / distSquared;
        }
    }

    return color * 1.5 * direct;
}

vec3 calculateDirectLighting(vec3 pos, vec3 viewDir, float depth) {
    vec3 color = vec3(0.0);

    for (int i = 0; i < uObjects; i++) {
        if (uLightIntensities[i] > 0.001) {
            vec3 lightPos = uObjectPositions[i];
            vec3 lightColor = uLightColors[i];
            float lightIntensity = uLightIntensities[i];

            vec3 toLight = lightPos - pos;
            float dist = length(toLight);
            vec3 lightDir = normalize(toLight);

            vec3 size = uObjectSizes[i];
            if (uObjectTypes[i] == 0) {  // Sphere
                float sizeLight = max(size.x, max(size.y, size.z));
                color += lightColor * lightIntensity * pow(max(0.0, dot(lightDir, viewDir)), dist * dist / (pow(sizeLight, 2.0)));
            } else {  // Box
                // Transform light direction to box's local space
                mat3 rotationMatrix = createRotationMatrix(uObjectRotations[i]);
                vec3 localLightDir = transpose(rotationMatrix) * lightDir;
                
                // Calculate approximate elliptical falloff based on box dimensions
                float xFactor = (1.0 - abs(localLightDir.x)) * size.x;
                float yFactor = (1.0 - abs(localLightDir.y)) * size.y;
                float zFactor = (1.0 - abs(localLightDir.z)) * size.z;
                float sizeLight = sqrt(xFactor * xFactor + yFactor * yFactor + zFactor * zFactor);
                
                // Calculate light contribution
                float dotProduct = max(0.0, dot(lightDir, viewDir));
                color += lightColor * lightIntensity * pow(dotProduct, dist * dist / (pow(sizeLight, 2.0)));
            }
        }
    }

    return color;
}


// Example usage in your fragment shader:
void main() {
    vec2 pixelCoord = gl_FragCoord.xy;
    vec2 ndc = (pixelCoord / uScreenSize) * 2.0 - 1.0;
    ndc.x *= uScreenSize.x / uScreenSize.y;
    
    // Calculate ray direction in world space
    vec3 forward = vec3(0.0, 0.0, -1.0);
    vec3 right = vec3(1.0, 0.0, 0.0);
    vec3 up = vec3(0.0, 1.0, 0.0);
    
    // Apply camera rotation to basis vectors
    forward = uCameraRotation * forward;
    right = uCameraRotation * right;
    up = uCameraRotation * up;
    
    // Calculate ray direction using rotated basis vectors
    vec3 rayDir = normalize(forward + right * ndc.x + up * ndc.y);
    
    vec3 color = vec3(0.0);
    vec3 rayOrigin = uCameraPosition;
    float rayEnergy = 1.0;

    IntersectionResult result;

    int i = 0;
    for (; i < 5 && rayEnergy > 0.01; i++) {
        result = intersectScene(rayOrigin, rayDir, -1);
        
        vec3 directLighting = calculateDirectLighting(rayOrigin, rayDir, result.distance);

        if (result.hit) {
            if (uLightIntensities[result.objectIndex] > 0.001) {
                color += uLightColors[result.objectIndex] * uLightIntensities[result.objectIndex] * rayEnergy * 10.0;
                break;
            }
            // Calculate lighting at the intersection point
            vec3 viewDir = -rayDir;
            vec3 lighting = calculateLighting(result.point, result.normal, viewDir, result.objectIndex);
            
            // Add lighting to the color
            color += uObjectColors[result.objectIndex] * (lighting + directLighting) * rayEnergy;
            
            // Handle reflection
            if (uObjectReflectivities[result.objectIndex] > 0.0) {
                rayOrigin = result.point + result.normal * 0.01;
                rayDir = reflect(rayDir, result.normal);
                rayEnergy *= uObjectReflectivities[result.objectIndex];
            } else {
                break;
            }
        } else {
            color += (getSkyColor(rayDir) + directLighting) * rayEnergy;
            break;
        }
    }

    if (i == 0 && !result.hit) {
        fragColor = vec4(getSkyColor(rayDir) + calculateDirectLighting(rayOrigin, rayDir, result.distance), 1.0);
    } else {
        fragColor = vec4(color, 1.0);
    }
}