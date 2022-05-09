import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'

const gtflLoader = new GLTFLoader()
const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()
mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

const resolveMesh = ({ resolve, model, scale, rot }) => {
  if (scale !== 1) model.scale.set(scale, scale, scale)
  const mesh = new THREE.Group()
  if (rot.angle) model.setRotationFromAxisAngle (new THREE.Vector3(...rot.axis), rot.angle)
  mesh.add(model)
  resolve({ mesh })
}

export const loadObj = ({ obj, mtl, scale = 1, rot = { axis: [0, 0, 0], angle: 0 } } = {}) =>
  mtl ? loadObjWithMtl({ obj, mtl, scale, rot }) : loadObjOnly({ obj, scale, rot })

export function loadObjOnly({ obj, scale, rot }) {
  return new Promise(resolve => {
    objLoader.load(`/assets/models/${obj}`, model => {
      resolveMesh({ resolve, model, scale, rot })
    })
  })
}

export function loadObjWithMtl({ obj, mtl, scale, rot }) {
  return new Promise(resolve => {
    mtlLoader.load(`/assets/models/${mtl}`, materials => {
      objLoader.setMaterials(materials)
      objLoader.load(`/assets/models/${obj}`, model => {
        resolveMesh({ resolve, model, scale, rot })
      })
    })
  })
}

export function loadGlb({ glb, scale = 1, rot = {}, autoplay = true } = {}) {
  return new Promise(resolve => {
    gtflLoader.load(`/assets/models/${glb}`, ({ scene: model, animations }) => {
      if (scale !== 1) model.scale.set(scale, scale, scale)
      const mixer = new THREE.AnimationMixer(model)
      if (autoplay) mixer.clipAction(animations[0]).play()
      const mesh = new THREE.Group()
      if (rot.angle) model.setRotationFromAxisAngle (new THREE.Vector3(...rot.axis), rot.angle)
      mesh.add(model)
      resolve({ mesh, mixer, animations })
    })
  })
}
