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
// parent groups for referencing in update
const meshGroup: THREE.Group = new THREE.Group();
const lightGroup: THREE.Group = new THREE.Group();
// audioAnalyzer needs to be global to scene so it can be referenced in update
let audioAnalyzer: THREE.AudioAnalyser;

(function start() {
  // camera manipulation
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

  // adding icosahedron from file ASYNC
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

  // creating lights
  createSpotlight("l1", 0xffffff, 10, lightGroup);
  lightGroup.getObjectByName("l1")!.position.set(0, 100, 100);
  createSpotlight("l2", 0xffffff, 10, lightGroup);
  lightGroup.getObjectByName("l2")!.position.set(0, 100, -100);

  // adding parent groups to scene
  scene.add(meshGroup);
  scene.add(lightGroup);
})();

(function update(time) {
  requestAnimationFrame(update);

  // change icosahedron color
  // needs to be here bc of load time from file (until we can figure out a loading situation)
  let icoMesh = meshGroup.getObjectByName("icosahedron")!
    .children[0] as THREE.Mesh;
  icoMesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff });

  // math sin does the oscillation back and forth once every second!
  // this should change to on beat situation
  meshGroup.getObjectByName("icosahedron")!.rotation.y = Math.sin(time! / 1000);
  meshGroup.getObjectByName("icosahedron")!.rotation.z = -Math.sin(
    time! / 1000
  );

  // save freqdata into more accessible array
  let freqData: Uint8Array = audioAnalyzer.getFrequencyData();
  // change icosahedron scales based on fft
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

  // required render for threejs
  renderer.render(scene, camera);
})();
