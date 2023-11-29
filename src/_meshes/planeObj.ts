import * as THREE from "three";

export function createPlane(
  name: string,
  parentGroup: THREE.Group,
  callback?: (threeObj: any) => void
) {
  // create geometry
  const planeGeom = new THREE.PlaneGeometry(1, 1, 1);
  // create mat
  const planeMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  // create mesh
  const planeMesh = new THREE.Mesh(planeGeom, planeMat);

  // set plane name
  planeMesh.name = name;

  // append to parentGroup
  parentGroup.add(planeMesh);

  // if theres a callback, use it, otherwise dont do anything
  callback ? callback(planeMesh) : null;
}
