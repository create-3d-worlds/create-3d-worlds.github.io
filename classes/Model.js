import { MD2Loader } from '../node_modules/three/examples/jsm/loaders/MD2Loader.js'

const textureLoader = new THREE.TextureLoader()
const modelLoader = new MD2Loader()
const baseDir = '../assets/models/ogro/'

let a = 0

export default class Model {
  constructor(onLoad, modelSrc = `${baseDir}ogro.md2`, textureSrc = `${baseDir}skins/arboshak.png`) {
    this.mesh = null
    this.mixer = null
    this.currentAnimation = null
    this.loadModel(onLoad, modelSrc, textureSrc)
  }

  loadModel(onLoad, modelSrc, textureSrc) {
    const texture = textureLoader.load(textureSrc)
    modelLoader.load(modelSrc, geometry => {
      const {animations} = geometry

      const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        wireframe: false,
        map: texture,
        morphTargets: true,
        morphNormals: true
      })
      this.mesh = new THREE.Mesh(geometry, material)

      this.mixer = new THREE.AnimationMixer(this.mesh)
      this.currentAnimation = animations[0]
      this.mixer.clipAction(this.currentAnimation).play()
      onLoad(this.mesh)

      document.addEventListener('click', () => {
        if (this.currentAnimation) this.mixer.clipAction(this.currentAnimation).stop()
        this.currentAnimation = animations[++a % animations.length]
        console.log(this.currentAnimation)
        this.mixer.clipAction(this.currentAnimation).play()
      })
    })
  }

  idle() {}

  walk() {}

  jump() {}

  update(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}