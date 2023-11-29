import * as THREE from "three";

export const audioGlobals = {
  audioLoader: new THREE.AudioLoader(),
  audioListener: new THREE.AudioListener(),
  sounds: new Map<string, THREE.Audio>(),
  soundAnalysers: new Map<string, THREE.AudioAnalyser>(),
};
