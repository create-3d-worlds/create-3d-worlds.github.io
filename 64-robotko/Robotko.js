import * as THREE from '../node_modules/three/build/three.module.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

const animNames = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing', 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp']

let a = 0 // debug helper

export default class Robotko {
  constructor(scene) {
    this.scene = scene
    this.actions = {}
    this.model = null
    this.mixer = null
    this.currentAction = null
    this.previousAction = null
    this.loadModel()
    this.addEvents()
  }

  loadModel() {
    const loader = new GLTFLoader()
    loader.load('models/RobotExpressive.glb', data => {
      this.model = data.scene
      this.scene.add(this.model)
      this.createActions(data.animations)
      console.log(data.animations)
    })
  }

  createActions(animations) {
    // https://threejs.org/docs/#api/en/animation/AnimationMixer
    this.mixer = new THREE.AnimationMixer(this.model)
    animations.forEach(animation => {
      const action = this.mixer.clipAction(animation)
      this.actions[animation.name] = action
      if (animNames.indexOf(animation.name) >= 4) {
        console.log(action._clip.name)
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
      }
    })
    this.currentAction = this.actions.Walking
    this.currentAction.play()
  }

  changeAction(name, duration) {
    // https://threejs.org/docs/#api/en/animation/AnimationAction
    this.previousAction = this.currentAction
    this.currentAction = this.actions[name]

    if (this.previousAction !== this.currentAction)
      this.previousAction.fadeOut(duration)

    this.currentAction.fadeIn(duration).play()
  }

  addEvents() {
    document.body.addEventListener('click', () => {
      const action = animNames[a++ % animNames.length]
      this.changeAction(action)
    })
  }

  upadate(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
