import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { MD2Loader } from '/node_modules/three108/examples/jsm/loaders/MD2Loader.js'

const textureLoader = new THREE.TextureLoader()

/* HELPERS */

const getScale = (mesh, newHeight) => {
  const box = new THREE.Box3().setFromObject(mesh)
  const height = box.max.y - box.min.y
  const scale = newHeight / height
  return scale
}

const translateY = mesh => {
  const box = new THREE.Box3().setFromObject(mesh)
  const bottom = box.min.y < 0 ? Math.abs(box.min.y) : 0
  mesh.translateY(bottom)
}

// need to preserve model orientation
const createGroup = (model, rot) => {
  const group = new THREE.Group()
  model.setRotationFromAxisAngle(new THREE.Vector3(...rot.axis), rot.angle)
  group.add(model)
  return group
}

const prepareMesh = ({ resolve, model, size, rot = { axis: [0, 0, 0], angle: 0 }, animations }) => {
  const scale = size ? getScale(model, size) : 1
  model.scale.set(scale, scale, scale)
  translateY(model)
  model.traverse(child => {
    if (!child.isMesh) return
    child.castShadow = true
    // child.receiveShadow = true
  })
  const mesh = rot.angle ? createGroup(model, rot) : model
  resolve({ mesh, animations })
}

/* OBJ */

export const loadObj = ({ file, mtl, size, rot } = {}) => {
  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

  return mtl
    ? new Promise(resolve => {
      mtlLoader.load(`/assets/models/${mtl}`, materials => {
        objLoader.setMaterials(materials)
        objLoader.load(`/assets/models/${file}`, model => {
          prepareMesh({ resolve, model, size, rot })
        })
      })
    })
    : new Promise(resolve => {
      objLoader.load(`/assets/models/${file}`, model => {
        prepareMesh({ resolve, model, size, rot })
      })
    })

}

/* GLB */

export function loadGlb({ file, size, rot } = {}) {
  const gtflLoader = new GLTFLoader()
  return new Promise(resolve => {
    gtflLoader.load(`/assets/models/${file}`, ({ scene, animations }) => {
      prepareMesh({ resolve, model: scene.children[0], size, rot, animations })
    })
  })
}

/* DAE */

export function loadDae({ file, size, rot } = {}) {
  const colladaLoader = new ColladaLoader()
  return new Promise(resolve => {
    colladaLoader.load(`/assets/models/${file}`, ({ scene: model, animations }) => {
      prepareMesh({ resolve, model, size, rot, animations })
    })
  })
}

/* DAE */

export function loadMd2({ file, size, rot, texture } = {}) {
  const loader = new MD2Loader()
  const map = textureLoader.load(`/assets/models/${texture}`)

  return new Promise(resolve => {
    loader.load(`/assets/models/${file}`, geometry => {
      const { animations } = geometry
      const material = new THREE.MeshLambertMaterial({ map, morphTargets: true }) // morphNormals: true
      const model = new THREE.Mesh(geometry, material)
      model.name = 'model' // ?
      prepareMesh({ resolve, model, size, rot, animations })
    })
  })
}

/* MASTER LOADER */

/*
* Handle model load, resize, rotate, etc.
* returns a promise that resolves with the { mesh, animations }
*/
export const loadModel = ({ file, size, rot, mtl, texture }) => {
  const ext = file.split('.').pop()
  switch (ext) {
    case 'obj':
      return loadObj({ file, mtl, size, rot })
    case 'glb':
      return loadGlb({ file, size, rot })
    case 'dae':
      return loadDae({ file, size, rot })
    case 'md2':
      return loadMd2({ file, size, rot, texture })
    default:
      throw new Error(`Unknown file extension: ${ext}`)
  }
}
