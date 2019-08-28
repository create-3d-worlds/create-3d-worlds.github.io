import { MD2Loader } from '../node_modules/three/examples/jsm/loaders/MD2Loader.js'

const textureLoader = new THREE.TextureLoader()
const modelLoader = new MD2Loader()

let a = 0

/**
 * Base (abstract) class for load and animate 3D models.
 * @param callback is used to pass `mesh` to the scene.
 */
export default class Model {
  constructor(callback, modelSrc, textureSrc, size = 35) {
    this.mixer = null
    this.action = null
    this.loadModel(callback, modelSrc, textureSrc, size)
  }

  loadModel(callback, modelSrc, textureSrc, size) {
    const group = new THREE.Group()
    const texture = textureLoader.load(textureSrc)
    modelLoader.load(modelSrc, geometry => {
      this.animations = geometry.animations
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        morphTargets: true,
      })
      const mesh = new THREE.Mesh(geometry, material)
      this.scaleMesh(mesh, size)
      this.translateY(mesh)
      mesh.rotateY(Math.PI / 2)
      this.mixer = new THREE.AnimationMixer(mesh)
      this.debugAnimations()
      callback(group.add(mesh))
    })
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
    const {action} = this, {LoopOnce, LoopRepeat} = THREE
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

  crstand() {
    this.changeAnimation('crstand', THREE.LoopRepeat)
  }

  crwalk() {
    this.changeAnimation('crwalk', THREE.LoopRepeat)
  }

  attack() {
    this.changeAnimation('attack', THREE.LoopOnce)
  }

  death() {
    this.changeAnimation('death', THREE.LoopOnce)
  }

  debugAnimations() {
    document.addEventListener('click', () => {
      const {name} = this.animations[a++ % this.animations.length]
      this.changeAnimation(name)
    })
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
