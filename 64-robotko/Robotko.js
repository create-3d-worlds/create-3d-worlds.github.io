// https://threejs.org/examples/webgl_animation_skinning_morph.html
import * as THREE from '../node_modules/three/build/three.module.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

const animNames = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing', 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp', 'WalkJump'] // redosled je bitan

// TODO: dodati izraze lica
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

  loadModel() {
    const loader = new GLTFLoader()
    loader.load('../assets/models/robot.glb', ({scene, animations}) => {
      this.scene.add(scene)
      this.createActions(animations, scene)
    })
  }

  createActions(animations, model) {
    this.mixer = new THREE.AnimationMixer(model)
    animations.forEach(clip => {
      const action = this.mixer.clipAction(clip)
      this.actions[clip.name] = action
      if (animNames.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
      }
    })
    this.currentAction = this.actions.Walking
    this.currentAction.play()
  }

  changeAction(name, duration) {
    this.previousAction = this.currentAction
    this.currentAction = this.actions[name]
    if (this.previousAction !== this.currentAction)
      this.previousAction.fadeOut(duration)
    this.currentAction.fadeIn(duration).play()
  }

  addEvents() {
    document.addEventListener('keydown', e => {
      const num = Number(e.key)
      if (isNaN(num)) return
      this.changeAction(animNames[num])
    })
  }

  upadate(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
