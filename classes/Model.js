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
    this.currentAnimation = null
    this.loadModel(onLoad, modelSrc, textureSrc)
  }

  loadModel(onLoad, modelSrc, textureSrc) {
    const texture = textureLoader.load(textureSrc)
    modelLoader.load(modelSrc, geometry => {
      const group = new THREE.Group()
      const {animations} = geometry
      this.animations = animations
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        morphTargets: true,
        morphNormals: true
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.scale.set(.5, .5, .5)
      const box = new THREE.Box3().setFromObject(mesh)
      const bottom = box.min.y < 0 ? Math.abs(box.min.y) : 0
      mesh.rotateY(Math.PI / 2)
      mesh.translateY(bottom)

      this.mixer = new THREE.AnimationMixer(mesh)
      this.currentAnimation = animations[0]
      this.mixer.clipAction(this.currentAnimation).play()

      this.handleAnimation()

      group.add(mesh)
      onLoad(group)
    })
  }

  handleAnimation() {
    document.addEventListener('click', () => {
      if (this.currentAnimation) this.mixer.clipAction(this.currentAnimation).stop()
      this.currentAnimation = this.animations[++a % this.animations.length]
      console.log(this.currentAnimation)
      this.mixer.clipAction(this.currentAnimation).play()
    })
  }

  idle() {}

  walk() {}

  jump() {}

  update(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}