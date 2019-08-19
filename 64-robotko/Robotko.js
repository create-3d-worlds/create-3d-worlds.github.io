import * as THREE from '../node_modules/three/build/three.module.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ]
const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ]

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
    })
  }

  createActions(animations) {
    // https://threejs.org/docs/#api/en/animation/AnimationMixer
    this.mixer = new THREE.AnimationMixer(this.model)
  
    for (let i = 0; i < animations.length; i ++) {
      const clip = animations[i]
      const action = this.mixer.clipAction(clip)
      this.actions[clip.name] = action
      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
      }
    }
    // console.log(this.actions)
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
      const action = states[a++ % states.length]
      this.changeAction(action)
      console.log(action)
    })
  }

  upadate(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
