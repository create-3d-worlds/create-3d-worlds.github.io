import * as THREE from 'three'

import { fixColors } from '/utils/scene.js'
import { getHeight, centerMesh, adjustHeight } from '/utils/helpers.js'

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

/* group preserves model orientation */
const createGroup = model => {
  const group = new THREE.Group()
  group.add(model)
  return group
}

const prepareMesh = async({ model, size = 2, texture, angle, axis = [0, 1, 0], animations, shouldCenter, shouldAdjustHeight, castShadow = true, receiveShadow = false, scale = getScale(model, size) }) => {
  model.scale.set(scale, scale, scale)
  // https://stackoverflow.com/questions/28848863/
  if (shouldCenter) centerMesh(model)
  if (shouldAdjustHeight) adjustHeight(model)

  const map = texture ? await textureLoader.loadAsync(`/assets/textures/${texture}`) : null

  model.traverse(child => {
    if (child.isMesh) {
      child.castShadow = castShadow
      child.receiveShadow = receiveShadow
      if (map) child.material.map = map
      if (!child.geometry.attributes.normal) child.geometry.computeVertexNormals()
    }
  })

  if (angle) model.rotateOnWorldAxis(new THREE.Vector3(...axis), angle)

  const mixer = animations && animations.length ? getMixer(model, animations) : null

  return { mesh: createGroup(model), animations, mixer }
}

/* OBJ */

export const loadObj = async params => {
  const { file, mtl } = params
  const { OBJLoader } = await import('/node_modules/three/examples/jsm/loaders/OBJLoader.js')
  const { MTLLoader } = await import('/node_modules/three/examples/jsm/loaders/MTLLoader.js')

  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

  if (mtl) {
    const materials = await mtlLoader.loadAsync(`/assets/models/${mtl}`)
    objLoader.setMaterials(materials)
  }
  const model = await objLoader.loadAsync(`/assets/models/${file}`)
  return await prepareMesh({ model, ...params })
}

/* GLB */

export async function loadGlb(params) {
  const { GLTFLoader } = await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js')

  const gtflLoader = new GLTFLoader()
  const { scene, animations } = await gtflLoader.loadAsync(`/assets/models/${params.file}`)
  return await prepareMesh({ model: scene, animations, ...params })
}

/* DAE */

export async function loadDae(params) {
  const { ColladaLoader } = await import('/node_modules/three/examples/jsm/loaders/ColladaLoader.js')

  const colladaLoader = new ColladaLoader()
  const { scene } = await colladaLoader.loadAsync(`/assets/models/${params.file}`)
  return await prepareMesh({ model: scene, animations: scene.animations, ...params })
}

/* MD2 */

export async function loadMd2(params) {
  const { file, texture } = params
  const { MD2Loader } = await import('/node_modules/three/examples/jsm/loaders/MD2Loader.js')

  const loader = new MD2Loader()
  const map = await textureLoader.loadAsync(`/assets/models/${texture}`)
  const geometry = await loader.loadAsync(`/assets/models/${file}`)
  const { animations } = geometry
  const material = new THREE.MeshLambertMaterial({ map })
  const model = new THREE.Mesh(geometry, material)
  return await prepareMesh({ model, animations, ...params, texture: null })
}

/* FBX */

export async function loadFbx(params) {
  const { FBXLoader } = await import('/node_modules/three/examples/jsm/loaders/FBXLoader.js')

  const loader = new FBXLoader()
  const { file = 'model.fbx', doubleSide } = params
  const model = await loader.loadAsync(`/assets/models/${file}`)

  // fix holes in model
  if (doubleSide) model.traverse(child => {
    if (child.isMesh) child.material.side = THREE.DoubleSide
  })

  if (!params.animations && model.animations.length)
    model.animations[0].name = params.name

  const animations = params.animations ? params.animations : model.animations

  return await prepareMesh({ model, animations, ...params })
}

/* @param names: array or dict object */
export async function loadFbxAnimations(names, prefix = '') {
  const uniques = Array.isArray(names)
    ? Array.from(new Set(names))
    : Array.from(new Set(Object.values(names)))

  const promises = uniques.map(name => loadFbx({ name, file: prefix + name + '.fbx' }))
  const responses = await Promise.all(promises)

  return responses.map(res => res.animations[0])
}

/* MASTER LOADER */

/*
* Handle model load and preparation (scale, rotate, etc.)
* param object: { file, size, texture, mtl, angle, axis, shouldCenter, shouldAdjustHeight, ... }
  * param.animDict is needed for separate fbx animations
  * param.size sometimes not working, so you must use 'scale'
* returns a promise that resolves with the { mesh, animations, mixer }
*/
export const loadModel = async param => {
  const params = typeof param === 'object' ? param : { file: param }
  if (params.fixColors) fixColors()
  const ext = params.file.split('.').pop()
  switch (ext) {
    case 'obj':
      fixColors()
      return loadObj(params)
    case 'glb':
    case 'gltf':
      fixColors()
      return loadGlb(params)
    case 'dae':
      return loadDae(params)
    case 'md2':
      return loadMd2(params)
    case 'fbx':
      const { prefix, file, animDict } = params
      if (prefix) {
        params.file = prefix + file
        if (animDict) params.animations = await loadFbxAnimations(animDict, prefix)
      }
      return loadFbx(params)
    default:
      throw new Error(`Unknown file extension: ${ext}`)
  }
}
