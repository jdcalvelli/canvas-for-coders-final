// just a test shader
// should turn every pixel red

import * as THREE from "three";

export function getColorShaderDefinition() {
  return {
    uniforms: {
      color: { type: "vec3", value: new THREE.Color(0xacb6e5) },
    },
    vertexShader: `
		varying vec3 vUv;
		
		void main() {
			vUv = position;
			
			vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * modelViewPosition;
		}
	`,
    fragmentShader: `
		uniform vec3 color;
		
		void main() {
			gl_FragColor = vec4(color, 1.0);
		}
	`,
  };
}
