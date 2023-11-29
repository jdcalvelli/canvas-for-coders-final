import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function createGLTFObject(
  name: string,
  parentGroup: Map<string, THREE.Object3D>,
  path: string,
  callback: (threeObj: any) => void
) {
  const loader = new GLTFLoader();

  loader.load(path, function (gltf) {
    let gltfScene: THREE.Group = gltf.scene;
    gltfScene.name = name;

    parentGroup.set(name, gltf.scene);

    // run callback
    callback(gltfScene);
  });
}
