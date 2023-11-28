import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function createGLTFObject(
  name: string,
  parentGroup: THREE.Group,
  path: string,
  callback?: Function
) {
  const loader = new GLTFLoader();

  loader.load(path, function (gltf) {
    let gltfScene: THREE.Group = gltf.scene;
    gltfScene.name = name;
    parentGroup.add(gltf.scene);

    // if theres a callback, use it, otherwise dont do anything
    callback ? callback() : null;
  });
}
