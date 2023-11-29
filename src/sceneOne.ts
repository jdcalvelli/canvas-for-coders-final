import * as THREE from "three";
import "./style.css";
// global imports
import { audioGlobals } from "./__globals/audioGlobals";
import { threeGlobals } from "./__globals/threeGlobals";
// component imports
import { createSpotlight } from "./_lights/spotlightObj";
import { createGLTFObject } from "./_meshes/gltfObj";
import { createPlane } from "./_meshes/planeObj";
import { createSound } from "./_sounds/soundObj";

// scene properties
const scene: THREE.Scene = new THREE.Scene();
// parent groups
const meshGroup: THREE.Group = new THREE.Group();
const lightGroup: THREE.Group = new THREE.Group();

(function start() {
  // scene init
  // scene.background = new THREE.Color("white");

  // camera manipulation
  threeGlobals.camera.position.set(200, 100, 100);
  threeGlobals.camera.lookAt(0, 0, 0);
  threeGlobals.camera.add(audioGlobals.audioListener);

  // should also write a little helper for audio visuals that can just go in the top right (regular old bar chart situation)
  // sounds
  createSound(
    "haywyre",
    "src/__assets/_audio/Haywyre - Let Me Hear That (320 kbps).mp3",
    (result: THREE.Audio) => {
      result.play();
    }
  );

  // adding icosahedron from file ASYNC
  // attribution: Icosahedron 1,0 by Ina Yosun Chang [CC-BY] via Poly Pizza
  createGLTFObject(
    "icosahedron",
    meshGroup,
    "src/__assets/_models/Icosahedron.glb",
    (result: THREE.Group) => {
      result.traverse((element: any) => {
        if (element.isMesh) {
          element.material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
          });
          element.castShadow = true;
        }
      });
    }
  );

  // adding plane underneath
  createPlane("ground", meshGroup, (result: THREE.Mesh) => {
    result.scale.set(1000, 1000, 1000);
    result.rotation.x = -Math.PI * 0.5;
    result.position.y = -50;
    result.receiveShadow = true;
  });

  // creating lights
  createSpotlight(
    "l1",
    0xffffff,
    100,
    lightGroup,
    (result: THREE.SpotLight) => {
      result.position.set(0, 100, 100);
      result.castShadow = true;
    }
  );

  // adding parent groups to scene
  scene.add(meshGroup);
  scene.add(lightGroup);
})();

(function update(time) {
  requestAnimationFrame(update);

  // math sin does the oscillation back and forth
  // song bpm is 110 (beat duration = 60 / bpm)
  // using sound context time instead of update frame time
  if (audioGlobals.sounds.get("haywyre")!.isPlaying) {
    meshGroup.getObjectByName("icosahedron")!.rotation.y =
      2 *
      Math.sin(
        (audioGlobals.sounds.get("haywyre")!.context.currentTime * 1000) / 545.5
      );
    meshGroup.getObjectByName("icosahedron")!.rotation.z =
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
  meshGroup.getObjectByName("icosahedron")!.scale.x = Math.max(
    3,
    (7 * freqData[22]) / 255
  );
  meshGroup.getObjectByName("icosahedron")!.scale.y = Math.max(
    3,
    (7 * freqData[22]) / 255
  );
  meshGroup.getObjectByName("icosahedron")!.scale.z = Math.max(
    3,
    (7 * freqData[22]) / 255
  );

  // change icosahedron color
  let icoMesh = meshGroup.getObjectByName("icosahedron")!
    .children[0] as THREE.Mesh;
  // but this does exist lmao
  icoMesh.material.color.setRGB(
    freqData[1] / 255,
    freqData[11] / 255,
    freqData[22] / 255
  );

  // change spotlight intensity based on freqData
  lightGroup.getObjectByName("l1")!.intensity = Math.max(200, freqData[22]);
  if (freqData[22] >= 125) {
    console.log("OVER");
    lightGroup
      .getObjectByName("l1")!
      .color.setRGB(0.75, 0.2, freqData[22] / 255);
  } else {
    lightGroup.getObjectByName("l1")!.color.setRGB(1, 1, 1);
  }

  // required render for threejs
  threeGlobals.renderer.render(scene, threeGlobals.camera);
})();
