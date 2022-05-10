import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'

import { getScale } from '/utils/helpers.js'

const gtflLoader = new GLTFLoader()
const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()
const colladaLoader = new ColladaLoader()
mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

/* HELPER */

const resolveMesh = ({ resolve, model, size, rot = { axis: [0, 0, 0], angle: 0 }, animations }) => {
  const scale = size ? getScale(model, size) : 1
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

/* OBJ */

export const loadObj = ({ file, mtl, size, rot } = {}) =>
  mtl
    ? new Promise(resolve => {
      mtlLoader.load(`/assets/models/${mtl}`, materials => {
        objLoader.setMaterials(materials)
        objLoader.load(`/assets/models/${file}`, model => {
          resolveMesh({ resolve, model, size, rot })
        })
      })
    })
    : new Promise(resolve => {
      objLoader.load(`/assets/models/${file}`, model => {
        resolveMesh({ resolve, model, size, rot })
      })
    })

/* GLB */

export function loadGlb({ file, size, rot } = {}) {
  return new Promise(resolve => {
    gtflLoader.load(`/assets/models/${file}`, ({ scene: model, animations }) => {
      resolveMesh({ resolve, model, size, rot, animations })
    })
  })
}

/* DAE */

export function loadDae({ file, size, rot } = {}) {
  return new Promise(resolve => {
    colladaLoader.load(`/assets/models/${file}`, ({ scene: model, animations }) => {
      resolveMesh({ resolve, model, size, rot, animations })
    })
  })
}

/* UNIVERSAL */

export const loadModel = ({ file, size, rot, mtl }) => {
  const ext = file.split('.').pop()
  switch (ext) {
    case 'obj':
      return loadObj({ file, mtl, size, rot })
    case 'glb':
      return loadGlb({ file, size, rot })
    case 'dae':
      return loadDae({ file, size, rot })
    default:
      throw new Error(`Unknown file extension: ${ext}`)
  }
}
