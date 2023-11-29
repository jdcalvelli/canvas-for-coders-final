import * as THREE from "three";
import { audioGlobals } from "../../__globals/audioGlobals";

export function createSound(
  name: string,
  path: string,
  callback?: (threeObj: any) => void
) {
  let result = new THREE.Audio(audioGlobals.audioListener);

  audioGlobals.audioLoader.load(path, function (buffer: AudioBuffer) {
    result.setBuffer(buffer);
    result.setVolume(0.5);

    result.name = name;

    // add to global sound map
    audioGlobals.sounds.set(name, result);

    // add its affiliated audio analyzer to global map
    let affiliatedAudioAnalyser = new THREE.AudioAnalyser(result, 64);
    audioGlobals.soundAnalysers.set(name, affiliatedAudioAnalyser);

    // if theres a callback, use it, otherwise dont do anything
    callback ? callback(result) : null;
  });
}
