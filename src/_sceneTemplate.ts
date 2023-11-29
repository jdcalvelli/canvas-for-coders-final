import * as THREE from "three";
import "./style.css";
// global imports
import { threeGlobals } from "./__globals/threeGlobals";
// component imports
import { createSpotlight } from "./__components/_lights/spotlightObj";
import { createBox } from "./__components/_meshes/boxObj";
import { createPlane } from "./__components/_meshes/planeObj";

// SCENE PROPERTIES
// scene itself
const scene: THREE.Scene = new THREE.Scene();
// the raw tree of objects added to three scene
const sceneTree: THREE.Group = new THREE.Group();
// maps for referencing meshes and lights
const sceneMeshes: Map<string, THREE.Object3D> = new Map<
  string,
  THREE.Object3D
>();
const sceneLights: Map<string, THREE.Light> = new Map<string, THREE.Light>();

// START FUNCTION
(function start() {
  // CAMERA INIT
  threeGlobals.camera.position.set(200, 100, 100);
  threeGlobals.camera.lookAt(0, 0, 0);

  // SOUNDS INIT

  // MESH INIT
  // adding plane underneath
  createPlane("ground", sceneMeshes, (result: THREE.Mesh) => {
    result.scale.set(1000, 1000, 1000);
    result.rotation.x = -Math.PI * 0.5;
    result.position.y = -50;
    result.receiveShadow = true;

    sceneTree.add(sceneMeshes.get("ground")!);
  });

  createBox("box", sceneMeshes, (result: THREE.Mesh) => {
    result.scale.set(40, 40, 40);
    result.castShadow = true;

    sceneTree.add(sceneMeshes.get("box")!);
  });

  // LIGHTS INIT
  // spotlight
  createSpotlight("l1", 0xffffff, 100, sceneLights, (result) => {
    result.position.set(0, 100, 100);
    result.castShadow = true;

    sceneTree.add(sceneLights.get("l1")!);
  });

  // SCENETREE INIT
  scene.add(sceneTree);
})();

// UPDATE FUNCTION
(function update(time) {
  requestAnimationFrame(update);

  // spin cube example
  sceneMeshes
    .get("box")!
    .rotation.set(Math.sin(time! / 1000), -Math.sin(time! / 1000), 0);

  // required render for threejs
  threeGlobals.renderer.render(scene, threeGlobals.camera);
})();
