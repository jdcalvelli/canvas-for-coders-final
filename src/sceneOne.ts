import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import "./style.css";
// global imports
import { createCamera } from "./_globals/camera";
import { createRenderer } from "./_globals/renderer";
// component imports
import { plane } from "./_meshes/plane";
import { sl1 } from "./_lights/sl1";
import { sl2 } from "./_lights/sl2";

// properties globals
const renderer: THREE.WebGLRenderer = createRenderer();
const camera: THREE.PerspectiveCamera = createCamera();
// scene locals
const scene: THREE.Scene = new THREE.Scene();

// redo these into dicts, not groups so that they're more easily accessible
const meshGroup: THREE.Group = new THREE.Group();
const lightGroup: THREE.Group = new THREE.Group();

// AUDIO ANALYZER INFO
let audioAnalyzer: THREE.AudioAnalyser;

(function init(): void {
  camera.position.set(200, 100, 100);
  camera.lookAt(0, 0, 0);

  // three audio
  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(
    "src/_assets/_audio/Haywyre - Let Me Hear That (320 kbps).mp3",
    function (buffer) {
      sound.setBuffer(buffer);
      sound.setVolume(0.5);
      sound.play();
    }
  );
  audioAnalyzer = new THREE.AudioAnalyser(sound, 64);

  // kick this all into a component
  const loader = new GLTFLoader();
  loader.load("src/_assets/_models/Icosahedron.glb", function (gltf) {
    let gltfScene = gltf.scene;
    gltfScene.scale.set(4, 4, 4);
    // changing color of only child
    gltfScene.children[0].material.color = 0x000000;

    meshGroup.add(gltfScene);
  });

  // adding plane underneath
  const p1: THREE.Mesh = plane();
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
  console.log(audioAnalyzer.getFrequencyData());

  renderer.render(scene, camera);
})();
