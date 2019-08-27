// https://threejs.org/examples/webgl_animation_skinning_morph.html
import * as THREE from '../node_modules/three/build/three.module.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

const loopOnce = ['Death', 'Sitting', 'Standing', 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp', 'WalkJump']

export default class Robotko {
  constructor(scene) {
    this.scene = scene
    this.actions = {}
    this.mixer = null
    this.currentAction = null
    this.previousAction = null
    this.loadModel()
    this.addEvents()
  }

  // moze: robot.glb, girl.glb, izzy_female_character/scene.gltf, male_adventurer/scene.gltf
  loadModel() {
    const loader = new GLTFLoader()
    loader.load('../assets/models/robot.glb', ({scene: model, animations}) => {
      this.createActions(animations, model)
      this.scene.add(model)
    })
  }

  createActions(animations, model) {
    this.mixer = new THREE.AnimationMixer(model)
    animations.forEach(clip => {
      const action = this.mixer.clipAction(clip)
      this.actions[clip.name] = action
      if (loopOnce.includes(clip.name)) {
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
      }
    })
    this.currentAction = this.actions[Object.keys(this.actions)[0]]
    if (this.currentAction) this.currentAction.play()
  }

  startAction(action, duration) {
    this.previousAction = this.currentAction
    this.currentAction = action
    if (this.previousAction !== this.currentAction)
      this.previousAction.fadeOut(duration)
    this.currentAction.fadeIn(duration).play()
  }

  addEvents() {
    document.addEventListener('keydown', e => {
      const num = Number(e.key)
      if (isNaN(num)) return
      const keys = Object.keys(this.actions)
      const action = this.actions[keys[num]]
      this.startAction(action)
    })
  }

  upadate(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
