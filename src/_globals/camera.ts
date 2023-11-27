import * as THREE from "three";

export function createCamera(): THREE.PerspectiveCamera {
  // create camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  // return camera
  return camera;
}
