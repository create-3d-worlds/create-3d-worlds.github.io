import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { getScale } from '/utils/helpers.js'

const gtflLoader = new GLTFLoader()
const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()
mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

const resolveMesh = ({ resolve, model, size, rot, animations }) => {
  const scale = getScale(model, size)
  model.scale.set(scale, scale, scale)
  model.traverse(child => {
    if (!child.isMesh) return
    child.castShadow = true
    // child.receiveShadow = true
  })
  const mesh = new THREE.Group()
  if (rot.angle) model.setRotationFromAxisAngle(new THREE.Vector3(...rot.axis), rot.angle)
  mesh.add(model)
  resolve({ mesh, animations })
}

export const loadObj = ({ obj, mtl, size, rot = { axis: [0, 0, 0], angle: 0 } } = {}) =>
  mtl ? loadObjWithMtl({ obj, mtl, size, rot }) : loadObjOnly({ obj, size, rot })

export function loadObjOnly({ obj, size, rot }) {
  return new Promise(resolve => {
    objLoader.load(`/assets/models/${obj}`, model => {
      resolveMesh({ resolve, model, size, rot })
    })
  })
}

export function loadObjWithMtl({ obj, mtl, size, rot }) {
  return new Promise(resolve => {
    mtlLoader.load(`/assets/models/${mtl}`, materials => {
      objLoader.setMaterials(materials)
      objLoader.load(`/assets/models/${obj}`, model => {
        resolveMesh({ resolve, model, size, rot })
      })
    })
  })
}

export function loadGlb({ glb, size, rot = {} } = {}) {
  return new Promise(resolve => {
    gtflLoader.load(`/assets/models/${glb}`, ({ scene: model, animations }) => {
      resolveMesh({ resolve, model, size, rot, animations })
    })
  })
}

// TODO: loadModel({ file, size, rot })
