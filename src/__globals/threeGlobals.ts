import * as THREE from "three";

// exported objects
export const threeGlobals = {
  renderer: createRenderer(),
  camera: createCamera(),
};

// helper functions
function createRenderer(): THREE.WebGLRenderer {
  // create renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  // enable shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // init renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("#app")?.appendChild(renderer.domElement);

  // return renderer
  return renderer;
}

function createCamera(): THREE.PerspectiveCamera {
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
