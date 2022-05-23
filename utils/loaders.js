import * as THREE from '/node_modules/three119/build/three.module.js'

import { OBJLoader } from '/node_modules/three119/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three119/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '/node_modules/three119/examples/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from '/node_modules/three119/examples/jsm/loaders/ColladaLoader.js'
import { MD2Loader } from '/node_modules/three119/examples/jsm/loaders/MD2Loader.js'
import { FBXLoader } from '/node_modules/three119/examples/jsm/loaders/FBXLoader.js'

import { getHeight, centerObject, adjustHeight } from '/utils/helpers.js'

const textureLoader = new THREE.TextureLoader()

/* HELPERS */

const getScale = (mesh, newHeight) => {
  const height = getHeight(mesh)
  const scale = newHeight / height
  return scale
}

export const getMixer = (mesh, animations, i = 0) => {
  const mixer = new THREE.AnimationMixer(mesh)
  const action = mixer.clipAction(animations[i])
  action.play()
  return mixer
}

/* deprecated with adjustHeight */
// const translateY = mesh => {
//   const box = new THREE.Box3().setFromObject(mesh)
//   const bottom = box.min.y < 0 ? Math.abs(box.min.y) : 0
//   mesh.translateY(bottom)
// }

/* group preserves model orientation */
const createGroup = model => {
  const group = new THREE.Group()
  group.add(model)
  return group
}

const prepareMesh = ({ resolve, model, size, rot, animations, shouldCenter, shouldAdjustHeight, adjust }) => {
  const scale = size ? getScale(model, size) : 1
  model.scale.set(scale, scale, scale)

  // https://stackoverflow.com/questions/28848863/
  if (shouldCenter) centerObject(model)
  if (shouldAdjustHeight) adjustHeight(model)

  adjust(model)

  model.traverse(child => {
    if (!child.isMesh) return
    child.castShadow = true
    // child.receiveShadow = true
  })

  if (rot.angle) model.rotateOnWorldAxis(new THREE.Vector3(...rot.axis), rot.angle)
  const mixer = animations.length ? getMixer(model, animations) : null

  resolve({ mesh: createGroup(model), animations, mixer })
}

/* OBJ */

export const loadObj = params => {
  const { file, mtl } = params
  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

  return mtl
    ? new Promise(resolve => {
      mtlLoader.load(`/assets/models/${mtl}`, materials => {
        objLoader.setMaterials(materials)
        objLoader.load(`/assets/models/${file}`, model => {
          prepareMesh({ resolve, model, ...params })
        })
      })
    })
    : new Promise(resolve => {
      objLoader.load(`/assets/models/${file}`, model => {
        prepareMesh({ resolve, model, ...params })
      })
    })

}

/* GLB */

export function loadGlb(params) {
  const gtflLoader = new GLTFLoader()
  return new Promise(resolve => {
    gtflLoader.load(`/assets/models/${params.file}`, ({ scene, animations }) => {
      prepareMesh({ resolve, model: scene.children[0], animations, ...params })
    })
  })
}

/* DAE */

export function loadDae(params) {
  const colladaLoader = new ColladaLoader()
  return new Promise(resolve => {
    colladaLoader.load(`/assets/models/${params.file}`, ({ scene: model, animations }) => {
      prepareMesh({ resolve, model, animations, ...params })
    })
  })
}

/* MD2 */

export function loadMd2(params) {
  const { file, texture } = params
  const loader = new MD2Loader()
  const map = textureLoader.load(`/assets/models/${texture}`)

  return new Promise(resolve => {
    loader.load(`/assets/models/${file}`, geometry => {
      const { animations } = geometry
      const material = new THREE.MeshLambertMaterial({ map, morphTargets: true }) // morphNormals: true
      const model = new THREE.Mesh(geometry, material)
      model.name = 'model' // ?
      prepareMesh({ resolve, model, animations, ...params })
    })
  })
}

/* FBX */

export function loadFbxModel(params) {
  const loader = new FBXLoader()
  return new Promise(resolve => {
    loader.load(`/assets/models/${params.file}`, model => {
      const { animations } = model
      prepareMesh({ resolve, model, animations, ...params })
    })
  })
}

/* MASTER LOADER */

/*
* Handle model load, resize, rotate, etc.
* returns a promise that resolves with the { mesh, animations }
*/
export const loadModel = ({ file, size, mtl, texture, rot = { axis: [0, 0, 0], angle: 0 }, shouldCenter = false, shouldAdjustHeight = false, adjust = () => {} }) => {

  const params = { file, size, mtl, texture, rot, shouldCenter, shouldAdjustHeight, adjust }

  const ext = file.split('.').pop()
  switch (ext) {
    case 'obj':
      return loadObj(params)
    case 'glb':
    case 'gltf':
      return loadGlb(params)
    case 'dae':
      return loadDae(params)
    case 'md2':
      return loadMd2(params)
    case 'fbx':
      return loadFbxModel(params)
    default:
      throw new Error(`Unknown file extension: ${ext}`)
  }
}

/* ALIASES */

export const loadZeppelin = async() => await loadModel({
  file: 'zeppelin-santos-dumont/model.dae',
  size: 6,
  rot: { axis: [0, 1, 0], angle: Math.PI / 2 },
  shouldCenter: false,
  shouldAdjustHeight: false,
  adjust: model => model.translateX(12)
})