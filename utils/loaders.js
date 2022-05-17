import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { MD2Loader } from '/node_modules/three108/examples/jsm/loaders/MD2Loader.js'
import { FBXLoader } from '/node_modules/three108/examples/jsm/loaders/FBXLoader.js'
import { getHeight, centerObject, adjustHeight } from '/utils/helpers.js'

const textureLoader = new THREE.TextureLoader()

/* HELPERS */

const getScale = (mesh, newHeight) => {
  const height = getHeight(mesh)
  const scale = newHeight / height
  return scale
}

// deprecated with adjustHeight
// const translateY = mesh => {
//   const box = new THREE.Box3().setFromObject(mesh)
//   const bottom = box.min.y < 0 ? Math.abs(box.min.y) : 0
//   mesh.translateY(bottom)
// }

// need group to preserve model orientation
const createGroup = model => {
  const group = new THREE.Group()
  group.add(model)
  return group
}

const prepareMesh = ({ resolve, model, size, rot = { axis: [0, 0, 0], angle: 0 }, animations, shouldCenter = false, shouldAdjustHeight = false }) => {

  const scale = size ? getScale(model, size) : 1
  model.scale.set(scale, scale, scale)

  // https://stackoverflow.com/questions/28848863/
  if (shouldCenter) centerObject(model)
  if (shouldAdjustHeight) adjustHeight(model)

  model.traverse(child => {
    if (!child.isMesh) return
    child.castShadow = true
    // child.receiveShadow = true
  })

  if (rot.angle) model.rotateOnWorldAxis(new THREE.Vector3(...rot.axis), rot.angle)

  resolve({ mesh: createGroup(model), animations })
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
export const loadModel = ({ file, size, rot, mtl, texture, shouldCenter, shouldAdjustHeight }) => {
  const ext = file.split('.').pop()
  switch (ext) {
    case 'obj':
      return loadObj({ file, mtl, size, rot, shouldCenter, shouldAdjustHeight })
    case 'glb':
      return loadGlb({ file, size, rot, shouldCenter, shouldAdjustHeight })
    case 'dae':
      return loadDae({ file, size, rot, shouldCenter, shouldAdjustHeight })
    case 'md2':
      return loadMd2({ file, size, rot, texture, shouldCenter, shouldAdjustHeight })
    case 'fbx':
      return loadFbxModel({ file, size, rot, shouldCenter, shouldAdjustHeight })
    default:
      throw new Error(`Unknown file extension: ${ext}`)
  }
}
