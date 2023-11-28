import * as THREE from "three";

export function createPlane(): THREE.Mesh {
  // create geometry
  const planeGeom = new THREE.PlaneGeometry(1, 1, 1);
  // create mat
  const planeMat = new THREE.MeshStandardMaterial({ color: 0xcecece });
  // create mesh
  const planeMesh = new THREE.Mesh(planeGeom, planeMat);
  // return mesh
  return planeMesh;
}
