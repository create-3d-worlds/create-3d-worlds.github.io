import * as THREE from '../node_modules/three/build/three.module.js'
import { GUI } from '../node_modules/three/examples/jsm/libs/dat.gui.module.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { scene, renderer, camera, clock, createOrbitControls} from '../utils/scene.js'

const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ]
const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ]

let gui, mixer, actions, activeAction, previousAction, model, face

const api = { state: 'Walking' }

camera.position.set(- 5, 3, 10)
camera.lookAt(new THREE.Vector3(0, 2, 0))

const loader = new GLTFLoader()
loader.load('models/RobotExpressive.glb', data => {
  model = data.scene
  scene.add(model)
  createActions(model, data.animations)
  // createExpressionsGUI(model)
})

/* FUNCTIONS */

function createActions(model, animations) {
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

function createExpressionsGUI(model) {
  gui = new GUI()
  face = model.getObjectByName('Head_2')
  const expressions = Object.keys(face.morphTargetDictionary)
  const expressionFolder = gui.addFolder('Expressions')
  for (let i = 0; i < expressions.length; i ++)
  expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
  expressionFolder.open()
  // console.log(expressions)
}

function fadeToAction(name, duration) {
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
  fadeToAction(action)
  // console.log(action)
})