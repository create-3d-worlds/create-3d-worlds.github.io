import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'

export function loadObject({ mtl, obj, scale = 1 } = {}) {
  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })
  return new Promise(resolve => {
    mtlLoader.load(`/assets/models/${mtl}`, materials => {
      objLoader.setMaterials(materials)
      objLoader.load(`/assets/models/${obj}`, object => {
        object.scale.set(scale, scale, scale)
        resolve(object)
      })
    })
  })
}

export function loadGlb({ glb, scale = 1, autoplay = true } = {}) {
  const loader = new GLTFLoader()
  return new Promise(resolve => {
    loader.load(`/assets/models/${glb}`, ({ scene: model, animations }) => {
      model.scale.set(scale, scale, scale)
      const mixer = new THREE.AnimationMixer(model)
      if (autoplay) mixer.clipAction(animations[0]).setDuration(1).play()
      resolve({ model, mixer, animations })
    })
  })
}
