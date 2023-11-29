import * as THREE from "three";
import { audioGlobals } from "../__globals/audioGlobals";

export function createSound(
  name: string,
  parentGroup: THREE.Group,
  path: string,
  callback?: (threeObj: any) => void
) {
  let result = new THREE.Audio(audioGlobals.audioListener);

  audioGlobals.audioLoader.load(path, function (buffer: AudioBuffer) {
    result.setBuffer(buffer);
    result.setVolume(0.5);
    result.name = name;
    parentGroup.add(result);

    // if theres a callback, use it, otherwise dont do anything
    callback ? callback(result) : null;
  });
}
