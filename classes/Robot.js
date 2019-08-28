// https://threejs.org/examples/webgl_animation_skinning_morph.html
import Model from './Model.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()

export default class Robot extends Model {
  constructor(onLoad, size) {
    super(onLoad, '../assets/models/robot.glb', null, size)
  }

  loadModel(onLoad, modelSrc, textureSrc, size) {
    const group = new THREE.Group()
    loader.load(modelSrc, ({scene: mesh, animations}) => {
      this.animations = animations
      this.scaleMesh(mesh, size)
      this.translateY(mesh)
      mesh.rotateY(Math.PI)
      this.mixer = new THREE.AnimationMixer(mesh)
      this.debugAnimations()
      onLoad(group.add(mesh))
    })
  }

  idle() {
    // Idle, Dance, Wave
    this.changeAnimation('Idle', THREE.LoopRepeat)
  }

  // Walking
  walk() {
    this.changeAnimation('Running', THREE.LoopRepeat)
  }

  jump() {
    this.changeAnimation('Jump', THREE.LoopOnce)
  }

  attack() {
    this.changeAnimation('Punch', THREE.LoopOnce)
  }

  death() {
    this.changeAnimation('Death', THREE.LoopOnce)
  }
}