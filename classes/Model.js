import { MD2Loader } from '../node_modules/three/examples/jsm/loaders/MD2Loader.js'

const textureLoader = new THREE.TextureLoader()
const modelLoader = new MD2Loader()
const baseDir = '../assets/models/ogro/'

let a = 0

/**
 * Model class pass `mesh` to onLoad callback, and has animation methods.
 */
export default class Model {
  constructor(onLoad, modelSrc = `${baseDir}ogro.md2`, textureSrc = `${baseDir}skins/arboshak.png`) {
    this.mixer = null
    this.action = null
    this.loadModel(onLoad, modelSrc, textureSrc)
  }

  loadModel(onLoad, modelSrc, textureSrc) {
    const group = new THREE.Group()
    const texture = textureLoader.load(textureSrc)
    modelLoader.load(modelSrc, geometry => {
      const {animations} = geometry
      this.animations = animations
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        morphTargets: true,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.scale.set(.5, .5, .5)
      const box = new THREE.Box3().setFromObject(mesh)
      const bottom = box.min.y < 0 ? Math.abs(box.min.y) : 0
      mesh.rotateY(Math.PI / 2)
      mesh.translateY(bottom)

      this.mixer = new THREE.AnimationMixer(mesh)
      // this.changeAnimation('run')
      this.addEvent()

      group.add(mesh)
      onLoad(group)
    })
  }

  shouldNotChange(name) {
    const {action} = this, {LoopOnce, LoopRepeat} = THREE
    return action && (
      action.loop == LoopOnce && action.isRunning() // should finish one-time action
      || action._clip.name == name && action.loop == LoopRepeat // don't start same repeating action
    )
  }

  changeAnimation(name, loop) {
    if (!this.mixer || this.shouldNotChange(name)) return
    // console.log(name)
    if (this.action) this.action.stop()
    this.action = this.mixer.clipAction(name)
    this.action.setLoop(loop)
    this.action.play()
  }

  addEvent() {
    document.addEventListener('click', () => {
      const {name} = this.animations[a++ % this.animations.length]
      this.changeAnimation(name)
    })
  }

  idle() {
    // stand, flip, salute_alt
    this.changeAnimation('stand', THREE.LoopRepeat)
  }

  walk() {
    this.changeAnimation('run', THREE.LoopRepeat)
  }

  jump() {
    this.changeAnimation('jump', THREE.LoopOnce)
  }

  death() {
    // crdeath, deatha, deathb, deathc
    this.changeAnimation('deathc', THREE.LoopOnce)
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
