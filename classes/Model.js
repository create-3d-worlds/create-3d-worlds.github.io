import { MD2Loader } from '../node_modules/three/examples/jsm/loaders/MD2Loader.js'

const textureLoader = new THREE.TextureLoader()
const modelLoader = new MD2Loader()
const baseDir = '../assets/models/ogro/'

let a = 0
// Dupechesh animations: stand, run, attack, paina, painb, painc, jump, flip, salute_alt, bumflop, wavealt, sniffsniff, cstand001f, cstand002f, cstand003f, cstand004f, cstand005f, cstand006f, cstand007f, cstand008f, cstand009f, cstand010f, cstand011f, cstand012f, cstand013f, cstand014f, cstand015f, cstand016f, cstand017f, cstand018f, cstand019f, cwalk0009f, cwalk0019f, cwalk0029f, cwalk0039f, cwalk0049f, cwalk0059f, crattack, crpain, crdeath, deatha, deathb, deathc, boomhc

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
    this.changeAnimation('stand', THREE.LoopRepeat)
  }

  walk() {
    this.changeAnimation('run', THREE.LoopRepeat)
  }

  jump() {
    this.changeAnimation('jump', THREE.LoopOnce)
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}