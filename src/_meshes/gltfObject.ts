import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function createGLTFObject(path: string, parentGroup: THREE.Group): void {
  const loader = new GLTFLoader();

  loader.load(path, function (gltf) {
    parentGroup.add(gltf.scene);
  });
}
