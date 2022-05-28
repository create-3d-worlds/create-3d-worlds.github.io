import * as THREE from '/node_modules/three119/build/three.module.js'
import { ColladaLoader } from '/node_modules/three119/examples/jsm/loaders/ColladaLoader.js'
import { OrbitControls } from '/node_modules/three119/examples/jsm/controls/OrbitControls.js'

import renderer from './scene/renderer.js'
import ground from './actors/ground.js'
import Avion from './actors/Avion.js'
import DirectionalLight from './scene/DirectionalLight.js'

const scene = new THREE.Scene()

scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)

scene.add(
  new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .9),
  new DirectionalLight(0xffffff, .9),
  new THREE.AmbientLight(0x302B2F, .5)
)

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 1, 1000
)
camera.position.set(-68, 143, -90) // z: 0 stavlja kameru iza

const controls = new OrbitControls(camera, renderer.domElement)

let avion

/* FUNCTIONS */

const update = () => {
  requestAnimationFrame(update)
  controls.update()
  ground.rotate()
  avion.normalizePlane()
  camera.lookAt(avion.position)
  renderer.render(scene, camera)
}

/* EVENTS */

new ColladaLoader().load('assets/me-109/model.dae', collada => {
  avion = new Avion(collada.scene)
  scene.add(avion, ground)
  update()
})
