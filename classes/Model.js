import * as THREE from '/node_modules/three108/build/three.module.js'
import { MD2Loader } from '/node_modules/three108/examples/jsm/loaders/MD2Loader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from '/node_modules/three108/examples/jsm/loaders/FBXLoader.js'

const textureLoader = new THREE.TextureLoader()
const md2Loader = new MD2Loader()
const gltfLoader = new GLTFLoader()
const fbxLoader = new FBXLoader()

let a = 0

/**
 * Base (abstract) class for load and animate 3D models, for Player and NPC's.
 * @param callback is used to pass `mesh` to the caller, and eventually to the scene.
 */
export default class Model {
  constructor(callback, modelSrc, textureSrc, size = 35, format = 'md2') {
    this.mixer = null
    this.action = null
    this.animations = []
    if (format == 'md2') this.loadMd2Model(callback, modelSrc, textureSrc, size)
    if (format == 'glb') this.loadGlbModel(callback, modelSrc, size)
    if (format == 'fbx') this.loadFbxModel(callback, modelSrc, size)
  }

  loadMd2Model(callback, modelSrc, textureSrc, size) {
    const texture = textureLoader.load(textureSrc)
    md2Loader.load(modelSrc, geometry => {
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        morphTargets: true,
      })
      const mesh = new THREE.Mesh(geometry, material)
      this.animations = geometry.animations
      callback(this.prepareMesh(mesh, size, Math.PI / 2))
    })
  }

  loadGlbModel(callback, modelSrc, size) {
    gltfLoader.load(modelSrc, ({ scene: mesh, animations }) => {
      this.animations = animations
      callback(this.prepareMesh(mesh, size, Math.PI))
    })
  }

  loadFbxModel(callback, modelSrc, size) {
    fbxLoader.load(modelSrc, mesh => {
      this.animations = mesh.animations
      callback(this.prepareMesh(mesh, size, Math.PI))
    })
  }

  prepareMesh(mesh, size, rotate) {
    const group = new THREE.Group()
    this.scaleMesh(mesh, size)
    this.translateY(mesh)
    mesh.rotateY(rotate)
    // mesh.traverse(child => {
    //   if (child.isMesh) {
    //     child.castShadow = true
    //     child.receiveShadow = true
    //   }
    // })
    this.mixer = new THREE.AnimationMixer(mesh)
    this.debugAnimations()
    group.add(mesh)
    return group
  }

  scaleMesh(mesh, size) {
    const box = new THREE.Box3().setFromObject(mesh)
    const height = box.max.y - box.min.y
    const scale = size / height
    mesh.scale.set(scale, scale, scale)
  }

  translateY(mesh) {
    const scaledBox = new THREE.Box3().setFromObject(mesh)
    const bottom = scaledBox.min.y < 0 ? Math.abs(scaledBox.min.y) : 0
    mesh.translateY(bottom)
  }

  shouldNotChange(name) {
    const { action } = this, { LoopOnce, LoopRepeat } = THREE
    return action && (
      action.loop == LoopOnce && action.isRunning() // should finish one-time action
      || action._clip.name == name && action.loop == LoopRepeat // don't start same repeating action
    )
  }

  changeAnimation(name, loop) {
    // console.log(name)
    if (!this.mixer || this.shouldNotChange(name)) return
    if (this.action) this.action.stop()
    const clip = this.animations.find(c => c.name == name)
    this.action = this.mixer.clipAction(clip)
    this.action.setLoop(loop)
    this.action.play()
  }

  idle() {
    this.changeAnimation('idle', THREE.LoopRepeat)
  }

  walk() {
    this.changeAnimation('walk', THREE.LoopRepeat)
  }

  run() {
    this.changeAnimation('run', THREE.LoopRepeat)
  }

  jump() {
    this.changeAnimation('jump', THREE.LoopOnce)
  }

  squat() {
    this.changeAnimation('squat', THREE.LoopRepeat)
  }

  squatWalk() {
    this.changeAnimation('squatWalk', THREE.LoopRepeat)
  }

  attack() {
    this.changeAnimation('attack', THREE.LoopOnce)
  }

  death() {
    this.changeAnimation('death', THREE.LoopOnce)
  }

  debugAnimations() {
    document.addEventListener('click', () => {
      const { name } = this.animations[a++ % this.animations.length]
      this.changeAnimation(name)
    })
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
