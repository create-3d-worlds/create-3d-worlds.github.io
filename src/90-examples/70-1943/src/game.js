import * as THREE from '/node_modules/three119/build/three.module.js'
import { ColladaLoader } from '/node_modules/three119/examples/jsm/loaders/ColladaLoader.js'
import { OrbitControls } from '/node_modules/three119/examples/jsm/controls/OrbitControls.js'

import { scene, renderer, camera } from '/utils/scene.js'
import ground from './actors/ground.js'
import Avion from './actors/Avion.js'
import { createSunLight } from '/utils/light.js'

scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)

scene.add(
  new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .9),
  createSunLight({ x: 150, y: 350, z: -150 })
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
