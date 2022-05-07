import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'

export function loadObject({ mtl, obj, scale = 1 } = {}) {
  return new Promise(resolve => {
    const objLoader = new OBJLoader()
    const mtlLoader = new MTLLoader()
    mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

    mtlLoader.load(`/assets/models/${mtl}`, materials => {
      objLoader.setMaterials(materials)
      objLoader.load(`/assets/models/${obj}`, object => {
        object.scale.set(scale, scale, scale)
        resolve(object)
      })
    })
  })
}