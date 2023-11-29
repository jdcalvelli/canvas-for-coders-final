import * as THREE from "three";
import "./style.css";
// global imports
import { audioGlobals } from "./__globals/audioGlobals";
import { threeGlobals } from "./__globals/threeGlobals";
// component imports
import { createSpotlight } from "./__components/_lights/spotlightObj";
import { createGLTFObject } from "./__components/_meshes/gltfObj";
import { createPlane } from "./__components/_meshes/planeObj";
import { createSound } from "./__components/_sounds/soundObj";

// SCENE PROPERTIES
const scene: THREE.Scene = new THREE.Scene();
const sceneTree: THREE.Group = new THREE.Group();
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
  threeGlobals.camera.add(audioGlobals.audioListener);

  // SOUNDS INIT
  createSound(
    "haywyre",
    "src/__assets/_audio/Haywyre - Let Me Hear That (320 kbps).mp3",
    (result) => {
      result.play();
    }
  );

  // MESH INIT
  // attribution: Icosahedron 1,0 by Ina Yosun Chang [CC-BY] via Poly Pizza
  createGLTFObject(
    "icosahedron",
    sceneMeshes,
    "src/__assets/_models/Icosahedron.glb",
    (result) => {
      result.traverse((element: THREE.Object3D) => {
        if ((element as THREE.Mesh).isMesh) {
          (element as THREE.Mesh).material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
          });
          element.castShadow = true;
        }
      });

      sceneTree.add(sceneMeshes.get("icosahedron")!);
    }
  );
  createPlane("ground", sceneMeshes, (result: THREE.Mesh) => {
    result.scale.set(1000, 1000, 1000);
    result.rotation.x = -Math.PI * 0.5;
    result.position.y = -50;
    result.receiveShadow = true;

    sceneTree.add(sceneMeshes.get("ground")!);
  });

  // LIGHTS INIT
  createSpotlight("l1", 0xffffff, 100, sceneLights, (result) => {
    result.position.set(0, 100, 100);
    result.castShadow = true;

    sceneTree.add(sceneLights.get("l1")!);
  });

  // SCENETREE INIT
  scene.add(sceneTree);
})();

(function update(time) {
  requestAnimationFrame(update);

  // math sin does the oscillation back and forth
  // song bpm is 110 (beat duration = 60 / bpm)
  // using sound context time instead of update frame time
  if (audioGlobals.sounds.get("haywyre")!.isPlaying) {
    sceneMeshes.get("icosahedron")!.rotation.y =
      2 *
      Math.sin(
        (audioGlobals.sounds.get("haywyre")!.context.currentTime * 1000) / 545.5
      );
    sceneMeshes.get("icosahedron")!.rotation.z =
      2 *
      -Math.sin(
        (audioGlobals.sounds.get("haywyre")!.context.currentTime * 1000) / 545.5
      );
  }

  // save freqdata into more accessible array
  // not doing it with arrays is probably better? to be able to reference by key?
  let freqData: Uint8Array = audioGlobals.soundAnalysers
    .get("haywyre")!
    .getFrequencyData();
  // change icosahedron scales based on fft
  sceneMeshes.get("icosahedron")!.scale.x = Math.max(
    3,
    (7 * freqData[22]) / 255
  );
  sceneMeshes.get("icosahedron")!.scale.y = Math.max(
    3,
    (7 * freqData[22]) / 255
  );
  sceneMeshes.get("icosahedron")!.scale.z = Math.max(
    3,
    (7 * freqData[22]) / 255
  );

  // change icosahedron color
  sceneMeshes.get("icosahedron")!.traverse((element: THREE.Object3D) => {
    if ((element as THREE.Mesh).isMesh) {
      let elementMat = (element as THREE.Mesh)
        .material as THREE.MeshLambertMaterial;
      elementMat.color.setRGB(
        freqData[1] / 255,
        freqData[11] / 255,
        freqData[22] / 255
      );
    }
  });

  // change spotlight intensity based on freqData
  sceneLights.get("l1")!.intensity = Math.max(200, freqData[22]);
  if (freqData[22] >= 125) {
    console.log("OVER");
    sceneLights.get("l1")!.color.setRGB(0.75, 0.2, freqData[22] / 255);
  } else {
    sceneLights.get("l1")!.color.setRGB(1, 1, 1);
  }

  // required render for threejs
  threeGlobals.renderer.render(scene, threeGlobals.camera);
})();
