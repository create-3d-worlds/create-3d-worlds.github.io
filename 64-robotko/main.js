import * as THREE from '../node_modules/three/build/three.module.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { scene, renderer, camera, clock, createOrbitControls} from '../utils/scene.js'

const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ]
const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ]

let gui, mixer, actions, activeAction, previousAction, model, face

camera.position.set(- 5, 3, 10)
camera.lookAt(new THREE.Vector3(0, 2, 0))

class Robotko {
  constructor(scene) {
    this.scene = scene
    this.loadModel()
  }

  loadModel() {
    const loader = new GLTFLoader()
    loader.load('models/RobotExpressive.glb', data => {
      model = data.scene
      this.scene.add(model)
      this.createActions(model, data.animations)
    })
  }

  createActions(model, animations) {
    mixer = new THREE.AnimationMixer(model)
    actions = {}
  
    for (let i = 0; i < animations.length; i ++) {
      const clip = animations[i]
      const action = mixer.clipAction(clip)
      actions[clip.name] = action
      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
      }
    }
    // console.log(actions)
    activeAction = actions.Walking
    activeAction.play()
  }

  fadeToAction(name, duration) {
    previousAction = activeAction
    activeAction = actions[name]
  
    if (previousAction !== activeAction)
      previousAction.fadeOut(duration)
  
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play()
  }
}

const robot = new Robotko(scene)

/* FUNCTIONS */



/* INIT */

void function animate() {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()

/* EVENTS */

let a = 0
document.body.addEventListener('click', () => {
  const action = states[a++ % states.length]
  robot.fadeToAction(action)
  // console.log(action)
})