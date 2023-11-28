import * as THREE from "three";

export function createSpotlight(
  name: string,
  color: number,
  intensity: number,
  parentGroup: THREE.Group
) {
  // create spotlight with sensible defaults
  const spotLight = new THREE.SpotLight(color, intensity);
  spotLight.lookAt(0, 0, 0);
  spotLight.angle = Math.PI * 0.1;
  spotLight.penumbra = 0.3;
  spotLight.decay = 1;
  spotLight.distance = 300;

  // give name
  spotLight.name = name;

  // add to parentGroup
  parentGroup.add(spotLight);
}
