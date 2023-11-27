import * as THREE from "three";

export function box(): THREE.Mesh {
  // create geometry
  const boxGeom = new THREE.BoxGeometry(1, 1, 1);
  // create mat
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xcecece });
  // create mesh
  const boxMesh = new THREE.Mesh(boxGeom, boxMat);
  // return mesh
  return boxMesh;
}
