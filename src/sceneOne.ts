import * as THREE from "three";
import "./style.css";
// global imports
import { createCamera } from "./_globals/camera";
import { createRenderer } from "./_globals/renderer";
// component imports
import { createSpotlight } from "./_lights/spotlight";
import { createPlane } from "./_meshes/plane";
import { createGLTFObject } from "./_meshes/gltfObject";

// properties globals
const renderer: THREE.WebGLRenderer = createRenderer();
const camera: THREE.PerspectiveCamera = createCamera();
// scene locals
const scene: THREE.Scene = new THREE.Scene();

// redo these into objects, not groups so that they're more easily accessible
const meshGroup: THREE.Group = new THREE.Group();
const lightGroup: THREE.Group = new THREE.Group();

// AUDIO ANALYZER INFO
let audioAnalyzer: THREE.AudioAnalyser;

(function init(): void {
  camera.position.set(200, 100, 100);
  camera.lookAt(0, 0, 0);

  // three audio - kick this out into some other kind of thing (audio singleton?)
  // should also write a little helper for audio visuals that can just go in the top right (regular old bar chart situation)
  const listener: THREE.AudioListener = new THREE.AudioListener();
  camera.add(listener);
  const sound: THREE.Audio = new THREE.Audio(listener);
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

  // adding gltfobject
  createGLTFObject(
    "icosahedron",
    meshGroup,
    "src/_assets/_models/Icosahedron.glb"
  );

  // adding plane underneath
  createPlane("ground", meshGroup);
  //errors out bc it could not exist, but we know it does, so using ! (non null assertion operator)
  meshGroup.getObjectByName("ground")!.scale.set(100, 100, 100);
  meshGroup.getObjectByName("ground")!.rotation.x = -Math.PI * 0.5;
  meshGroup.getObjectByName("ground")!.position.y = -50;

  createSpotlight("l1", 0xffffff, 10, lightGroup);
  lightGroup.getObjectByName("l1")!.position.set(0, 100, 100);

  createSpotlight("l2", 0xffffff, 10, lightGroup);
  lightGroup.getObjectByName("l2")!.position.set(0, 100, -100);

  // adding parent groups to scene
  scene.add(meshGroup);
  scene.add(lightGroup);
})();

(function update(timeStamp): void {
  // why is this erroring lmao
  requestAnimationFrame(update);

  // gotta find a better way to be able to reference objects
  // math sin does the oscillation back and forth once every second!
  // this should change to on beat situation
  meshGroup.getObjectByName("icosahedron")!.rotation.y = Math.sin(
    timeStamp / 1000
  );
  meshGroup.getObjectByName("icosahedron")!.rotation.z = -Math.sin(
    timeStamp / 1000
  );

  // showing that the audio analyzer is working
  let freqData: Uint8Array = audioAnalyzer.getFrequencyData();
  console.log(freqData);
  // change scales based on fft
  meshGroup.getObjectByName("icosahedron")!.scale.x = Math.max(
    3,
    (8 * freqData[22]) / 255
  );
  meshGroup.getObjectByName("icosahedron")!.scale.y = Math.max(
    3,
    (8 * freqData[22]) / 255
  );
  meshGroup.getObjectByName("icosahedron")!.scale.z = Math.max(
    3,
    (8 * freqData[22]) / 255
  );

  renderer.render(scene, camera);
})();
