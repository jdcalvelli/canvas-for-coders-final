import * as THREE from "three";

export function createRenderer(): THREE.WebGLRenderer {
  // create renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  // init renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("#app")?.appendChild(renderer.domElement);

  // return renderer
  return renderer;
}
