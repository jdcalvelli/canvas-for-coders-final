import * as THREE from "three";

export function createSpotlight(
  name: string,
  color: number,
  intensity: number,
  parentGroup: Map<string, THREE.Light>,
  callback: (threeObj: any) => void
) {
  // create spotlight with sensible defaults
  const spotLight = new THREE.SpotLight(color, intensity);
  spotLight.distance = 0;
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 1;
  spotLight.decay = 1;

  // give name
  spotLight.name = name;

  // add to parentGroup
  parentGroup.set(name, spotLight);

  // run callback
  callback(spotLight);
}
