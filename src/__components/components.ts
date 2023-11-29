import { createSpotlight } from "./_lights/spotlightObj";
import { createBox } from "./_meshes/boxObj";
import { createGLTFObject } from "./_meshes/gltfObj";
import { createPlane } from "./_meshes/planeObj";
import { createSound } from "./_sounds/soundObj";

export const Components = {
  meshes: {
    createBox: createBox,
    createPlane: createPlane,
    createGLTFObject: createGLTFObject,
  },
  lights: {
    createSpotlight: createSpotlight,
  },
  sounds: {
    createSound: createSound,
  },
};
