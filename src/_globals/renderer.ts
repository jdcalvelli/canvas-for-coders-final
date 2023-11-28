import * as THREE from "three";

export function createRenderer(): THREE.WebGLRenderer {
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
