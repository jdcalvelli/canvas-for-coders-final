import * as THREE from "three";
import "./style.css";
// global imports
import { Components } from "./__components/components";
import { audioGlobals } from "./__globals/audioGlobals";
import { threeGlobals } from "./__globals/threeGlobals";

// should be pushed into engine layer perhaps
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { ShaderPass } from "three/examples/jsm/Addons.js";
import { FilmPass } from "three/examples/jsm/Addons.js";
import { getDistortionShaderDefinition } from "./__shaders/lensDistortionShader";
import { degToRad } from "three/src/math/MathUtils.js";

// SCENE PROPERTIES
const scene: THREE.Scene = new THREE.Scene();
const sceneTree: THREE.Group = new THREE.Group();
const sceneMeshes: Map<string, THREE.Object3D> = new Map<
  string,
  THREE.Object3D
>();
const sceneLights: Map<string, THREE.Light> = new Map<string, THREE.Light>();

// should be pushed into engine layer perhaps
const effectComposer: EffectComposer = new EffectComposer(
  threeGlobals.renderer
);

// run after click so as to get around webcontextapi interaction problem
window.addEventListener("click", start);

// START FUNCTION
function start() {
  // effect render pipeline test
  // clear render
  effectComposer.addPass(new RenderPass(scene, threeGlobals.camera));
  // test distortion shader
  let lensDistortionShader: ShaderPass = new ShaderPass(
    getDistortionShaderDefinition()
  );
  lensDistortionShader.uniforms["strength"].value = 1;
  lensDistortionShader.uniforms["height"].value = Math.tan(
    degToRad(threeGlobals.camera.fov / 2)
  );
  lensDistortionShader.uniforms["aspectRatio"].value =
    threeGlobals.camera.aspect;
  lensDistortionShader.uniforms["cylindricalRatio"].value = 2;

  effectComposer.addPass(lensDistortionShader);

  effectComposer.addPass(new FilmPass(2));

  // CAMERA INIT
  threeGlobals.camera.position.set(80, 50, 50);
  threeGlobals.camera.lookAt(0, 0, 0);
  threeGlobals.camera.add(audioGlobals.audioListener);

  // SOUND INIT
  // THIS IS A PROBLEM BC OF WEB CONTEXT API
  Components.sounds.createSound(
    "haywyre",
    "__assets/_audio/letmehearthat.mp3",
    (result: THREE.Audio) => {
      result.loop = true;
      result.play();
    }
  );

  // MESH INIT
  // attribution: Icosahedron 1,0 by Ina Yosun Chang [CC-BY] via Poly Pizza
  Components.meshes.createGLTFObject(
    "icosahedron",
    sceneMeshes,
    "__assets/_models/Icosahedron.glb",
    (result) => {
      result.traverse((element: THREE.Object3D) => {
        if ((element as THREE.Mesh).isMesh) {
          (element as THREE.Mesh).material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            alphaHash: true,
            opacity: 0.4,
          });
          element.castShadow = true;
        }
      });

      sceneTree.add(sceneMeshes.get("icosahedron")!);
    }
  );

  Components.meshes.createPlane("ground", sceneMeshes, (result: THREE.Mesh) => {
    result.scale.set(1000, 1000, 1000);
    result.rotation.x = -Math.PI * 0.5;
    result.position.y = -50;
    //result.receiveShadow = true;

    sceneTree.add(sceneMeshes.get("ground")!);
  });

  // create a plane specifically for shadow reception
  Components.meshes.createPlane(
    "ground_shadow",
    sceneMeshes,
    (result: THREE.Mesh) => {
      // change the material
      result.material = new THREE.ShadowMaterial({ opacity: 0.2 });
      result.scale.set(1000, 1000, 1000);
      result.rotation.x = -Math.PI * 0.5;
      result.position.y = -50;
      result.receiveShadow = true;

      sceneTree.add(sceneMeshes.get("ground_shadow")!);
    }
  );

  // LIGHTS INIT
  Components.lights.createSpotlight(
    "l1",
    0xffffff,
    100,
    sceneLights,
    (result) => {
      result.position.set(0, 100, 100);
      result.castShadow = true;

      sceneTree.add(sceneLights.get("l1")!);
    }
  );

  // SCENETREE INIT
  scene.add(sceneTree);
}

(function update(_time) {
  // this is a bad idea generally, but until i can figure out the problem it will have to do
  //@ts-ignore
  requestAnimationFrame(update);

  // math sin does the oscillation back and forth
  // song bpm is 110 (beat duration = 60 / bpm)
  // using sound context time instead of update frame time
  if (audioGlobals.sounds.get("haywyre")!.isPlaying) {
    sceneMeshes.get("icosahedron")!.rotation.y =
      2 *
      Math.sin(
        (audioGlobals.sounds.get("haywyre")!.context.currentTime * 1000) / 545.5
      );
    sceneMeshes.get("icosahedron")!.rotation.z =
      2 *
      -Math.sin(
        (audioGlobals.sounds.get("haywyre")!.context.currentTime * 1000) / 545.5
      );
  }

  // save freqdata into more accessible array
  // not doing it with arrays is probably better? to be able to reference by key?
  let freqData: Uint8Array = audioGlobals.soundAnalysers
    .get("haywyre")!
    .getFrequencyData();
  // change icosahedron scales based on fft
  sceneMeshes.get("icosahedron")!.scale.x = Math.max(
    3,
    (7 * freqData[22]) / 255
  );
  sceneMeshes.get("icosahedron")!.scale.y = Math.max(
    3,
    (7 * freqData[22]) / 255
  );
  sceneMeshes.get("icosahedron")!.scale.z = Math.max(
    3,
    (7 * freqData[22]) / 255
  );

  // change icosahedron color
  sceneMeshes.get("icosahedron")!.traverse((element: THREE.Object3D) => {
    if ((element as THREE.Mesh).isMesh) {
      let elementMat = (element as THREE.Mesh)
        .material as THREE.MeshLambertMaterial;
      elementMat.color.setRGB(
        freqData[1] / 255,
        freqData[11] / 255,
        freqData[22] / 255
      );
    }
  });

  // change spotlight intensity based on freqData
  sceneLights.get("l1")!.intensity = Math.max(200, freqData[22]);
  if (freqData[22] >= 125) {
    console.log("OVER");
    sceneLights.get("l1")!.color.setRGB(0.75, 0.2, freqData[22] / 255);
  } else {
    sceneLights.get("l1")!.color.setRGB(1, 1, 1);
  }

  // required render for threejs
  //threeGlobals.renderer.render(scene, threeGlobals.camera);
  // because we're using effect composer, need to use this render instead of traditional
  effectComposer.render();
})();
