import * as THREE from "three";

export function createPlane(
  name: string,
  parentGroup: Map<string, THREE.Object3D>,
  callback: (threeObj: any) => void
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
  parentGroup.set(name, planeMesh);

  // run callback
  callback(planeMesh);
}
