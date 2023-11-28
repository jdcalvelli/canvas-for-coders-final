import * as THREE from "three";

export function createPlane(name: string, parentGroup: THREE.Group) {
  // create geometry
  const planeGeom = new THREE.PlaneGeometry(1, 1, 1);
  // create mat
  const planeMat = new THREE.MeshStandardMaterial({ color: 0xcecece });
  // create mesh
  const planeMesh = new THREE.Mesh(planeGeom, planeMat);
  // set plane name
  planeMesh.name = name;

  // append to parentGroup
  parentGroup.add(planeMesh);
}
