import * as THREE from "three";

export function sl1(): THREE.SpotLight {
  // create spotlight
  // spot light
  const spotLight = new THREE.SpotLight(0xffffff, 10);
  spotLight.position.set(0, 100, 100);
  spotLight.lookAt(0, 0, 0);
  spotLight.angle = Math.PI * 0.1;
  spotLight.penumbra = 0.3;
  spotLight.decay = 1;
  spotLight.distance = 300;

  return spotLight;
}
