import * as THREE from "three";
import "./style.css";
// global imports
import { createCamera } from "./_globals/camera";
import { createRenderer } from "./_globals/renderer";
// component imports
import { createSpotlight } from "./_lights/spotlight";
import { createGLTFObject } from "./_meshes/gltfObject";
import { createPlane } from "./_meshes/plane";

// properties globals
const renderer: THREE.WebGLRenderer = createRenderer();
const camera: THREE.PerspectiveCamera = createCamera();

// scene locals
const scene: THREE.Scene = new THREE.Scene();
// parent groups for referencing in update
const meshGroup: THREE.Group = new THREE.Group();
const lightGroup: THREE.Group = new THREE.Group();
// audioAnalyzer needs to be global to scene so it can be referenced in update
let sound: THREE.Audio;
let audioAnalyzer: THREE.AudioAnalyser;

(function start() {
  // scene init
  //scene.background = new THREE.Color("white");

  // camera manipulation
  camera.position.set(200, 100, 100);
  camera.lookAt(0, 0, 0);

  // three audio - kick this out into some other kind of thing (audio singleton?)
  // should also write a little helper for audio visuals that can just go in the top right (regular old bar chart situation)
  const listener: THREE.AudioListener = new THREE.AudioListener();
  camera.add(listener);
  sound = new THREE.Audio(listener);
  const audioLoader: THREE.AudioLoader = new THREE.AudioLoader();
  audioLoader.load(
    "src/_assets/_audio/Haywyre - Let Me Hear That (320 kbps).mp3",
    function (buffer: AudioBuffer) {
      sound.setBuffer(buffer);
      sound.setVolume(0.5);
      sound.play();
    }
  );
  audioAnalyzer = new THREE.AudioAnalyser(sound, 64);

  // adding icosahedron from file ASYNC
  // attribution: Icosahedron 1,0 by Ina Yosun Chang [CC-BY] via Poly Pizza
  createGLTFObject(
    "icosahedron",
    meshGroup,
    "src/_assets/_models/Icosahedron.glb",
    (result: THREE.Group) => {
      result.traverse((element: any) => {
        if (element.isMesh) {
          element.material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
          });
          element.castShadow = true;
          element.receiveShadow = true;
        }
      });
    }
  );

  // adding plane underneath
  createPlane("ground", meshGroup, (result: THREE.Mesh) => {
    result.scale.set(1000, 1000, 1000);
    result.rotation.x = -Math.PI * 0.5;
    result.position.y = -50;
    result.castShadow = true;
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
  if (sound.isPlaying) {
    meshGroup.getObjectByName("icosahedron")!.rotation.y =
      2 * Math.sin((sound.context.currentTime * 1000) / 545.5);
    meshGroup.getObjectByName("icosahedron")!.rotation.z =
      2 * -Math.sin((sound.context.currentTime * 1000) / 545.5);
  }

  // save freqdata into more accessible array
  let freqData: Uint8Array = audioAnalyzer.getFrequencyData();
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
  renderer.render(scene, camera);
})();
