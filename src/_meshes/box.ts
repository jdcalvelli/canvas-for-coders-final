import * as THREE from "three";

export function createBox(name: string, parentGroup: THREE.Group) {
  // create geometry
  const boxGeom = new THREE.BoxGeometry(1, 1, 1);
  // create mat
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xcecece });
  // create mesh
  const boxMesh = new THREE.Mesh(boxGeom, boxMat);
  // set box name
  boxMesh.name = name;

  // append to parentGroup
  parentGroup.add(boxMesh);
}
