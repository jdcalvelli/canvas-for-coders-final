import "./style.css";
import * as THREE from "three";
// global imports
import { createCamera } from "./_globals/camera";
import { createRenderer } from "./_globals/renderer";
// component imports
import { box1 } from "./_meshes/b1";
import { sl1 } from "./_lights/sl1";
import { sl2 } from "./_lights/sl2";

// properties globals
const renderer: THREE.WebGLRenderer = createRenderer();
const camera: THREE.PerspectiveCamera = createCamera();
// scene locals
const scene: THREE.Scene = new THREE.Scene();

const meshGroup: THREE.Group = new THREE.Group();
const lightGroup: THREE.Group = new THREE.Group();

(function init(): void {
  camera.position.set(200, 100, 100);
  camera.lookAt(0, 0, 0);

  const b1: THREE.Mesh = box1();
  meshGroup.add(b1);

  const l1: THREE.SpotLight = sl1();
  lightGroup.add(l1);
  // const slHelper: THREE.SpotLightHelper = new THREE.SpotLightHelper(l1);
  // scene.add(slHelper);

  const l2: THREE.SpotLight = sl2();
  lightGroup.add(l2);
  // const sl2Helper: THREE.SpotLightHelper = new THREE.SpotLightHelper(l2);
  // scene.add(sl2Helper);

  scene.add(meshGroup);
  scene.add(lightGroup);
})();

(function update(timeStamp): void {
  // why is this erroring lmao
  requestAnimationFrame(update);

  console.log(timeStamp);

  // gotta find a better way to be able to reference objects
  // math sin does the oscillation back and forth once every second!
  meshGroup.children[0].rotation.y = Math.sin(timeStamp / 1000);
  meshGroup.children[0].rotation.z = -Math.sin(timeStamp / 1000);

  renderer.render(scene, camera);
})();
