import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'

export function loadObj({ obj, mtl, scale = 1, rotateY = 0 } = {}) {
  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })
  return new Promise(resolve => {
    mtlLoader.load(`/assets/models/${mtl}`, materials => {
      objLoader.setMaterials(materials)
      objLoader.load(`/assets/models/${obj}`, model => {
        if (scale !== 1) model.scale.set(scale, scale, scale)

        const mesh = new THREE.Group()
        if (rotateY) model.rotateY(rotateY)
        mesh.add(model)

        resolve(mesh)
      })
    })
  })
}

export function loadGlb({ glb, scale = 1, rotateY = 0, autoplay = true } = {}) {
  const loader = new GLTFLoader()
  return new Promise(resolve => {
    loader.load(`/assets/models/${glb}`, ({ scene: model, animations }) => {
      if (scale !== 1) model.scale.set(scale, scale, scale)
      const mixer = new THREE.AnimationMixer(model)
      if (autoplay) mixer.clipAction(animations[0]).play()

      const mesh = new THREE.Group()
      if (rotateY) model.rotateY(rotateY)
      mesh.add(model)

      resolve({ mesh, mixer, animations })
    })
  })
}
