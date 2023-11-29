import * as THREE from "three";

export function createBox(
  name: string,
  parentGroup: THREE.Group,
  callback?: (threeObj: any) => void
) {
  // create geometry
  const boxGeom = new THREE.BoxGeometry(1, 1, 1);
  // create mat
  const boxMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  // create mesh
  const boxMesh = new THREE.Mesh(boxGeom, boxMat);
  // set box name
  boxMesh.name = name;

  // append to parentGroup
  parentGroup.add(boxMesh);

  // if theres a callback, use it, otherwise dont do anything
  callback ? callback(boxMesh) : null;
}
