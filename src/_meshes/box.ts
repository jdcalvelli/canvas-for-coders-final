import * as THREE from "three";

export function box1(): THREE.Mesh {
  // create geometry
  const boxGeom = new THREE.BoxGeometry(40, 40, 40);
  // create mat
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xcecece });
  // create mesh
  const boxMesh = new THREE.Mesh(boxGeom, boxMat);
  // return mesh
  return boxMesh;
}
