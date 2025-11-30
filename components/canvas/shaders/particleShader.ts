export const vertexShader = `
attribute float size;
attribute vec3 color;
varying vec3 vColor;

uniform float uTime;
uniform float uPixelRatio;

void main() {
  vColor = color;
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  
  // Add subtle breathing motion
  float timeOffset = position.x * 0.5 + position.y * 0.3 + position.z * 0.2;
  mvPosition.y += sin(uTime * 0.5 + timeOffset) * 0.1;
  
  gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const fragmentShader = `
varying vec3 vColor;
uniform float uTime;
uniform float uHoveredIndex;

void main() {
  // Circular particle shape with soft edge
  float r = distance(gl_PointCoord, vec2(0.5));
  if (r > 0.5) discard;
  
  // Soft glow falloff
  float glow = 1.0 - (r * 2.0);
  glow = pow(glow, 1.5);
  
  gl_FragColor = vec4(vColor, glow);
}
`
