import * as THREE from "three";
import "./style.css";
// global imports
import { createCamera } from "./_globals/camera";
import { createRenderer } from "./_globals/renderer";
// component imports
import { sl1 } from "./_lights/sl1";
import { sl2 } from "./_lights/sl2";
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
  // has to be a different setup bc of the way that loading objects works
  createGLTFObject("src/_assets/_models/Icosahedron.glb", meshGroup);

  // adding plane underneath
  const p1: THREE.Mesh = createPlane();
  p1.scale.set(100, 100, 100);
  p1.rotation.x = -Math.PI * 0.5;
  p1.position.y = -50;
  meshGroup.add(p1);

  // adding ambient light
  // const al1: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 1);
  // lightGroup.add(al1);

  const l1: THREE.SpotLight = sl1();
  lightGroup.add(l1);
  // const slHelper: THREE.SpotLightHelper = new THREE.SpotLightHelper(l1);
  // scene.add(slHelper);

  const l2: THREE.SpotLight = sl2();
  lightGroup.add(l2);
  // const sl2Helper: THREE.SpotLightHelper = new THREE.SpotLightHelper(l2);
  // scene.add(sl2Helper);

  // adding to scene
  scene.add(meshGroup);
  scene.add(lightGroup);
})();

(function update(timeStamp): void {
  // why is this erroring lmao
  requestAnimationFrame(update);

  // gotta find a better way to be able to reference objects
  // math sin does the oscillation back and forth once every second!
  meshGroup.children[1].rotation.y = Math.sin(timeStamp / 1000);
  meshGroup.children[1].rotation.z = -Math.sin(timeStamp / 1000);

  // showing that the audio analyzer is working
  let freqData: Uint8Array = audioAnalyzer.getFrequencyData();
  console.log(freqData);
  // change scales based on fft
  meshGroup.children[1].scale.x = Math.max(3, (8 * freqData[22]) / 255);
  meshGroup.children[1].scale.y = Math.max(3, (8 * freqData[22]) / 255);
  meshGroup.children[1].scale.z = Math.max(3, (8 * freqData[22]) / 255);

  renderer.render(scene, camera);
})();
