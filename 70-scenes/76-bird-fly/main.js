import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { renderer, scene } from '/utils/scene.js' // camera, createOrbitControls
import {createGround} from '/utils/floor.js'
import Avion from './Avion.js'

let avion

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.set(0, 10, 250)

scene.add(createGround(10000, null))

// MODEL

new ColladaLoader().load('/assets/models/s-e-5a/model.dae', collada => {
  avion = new Avion(collada.scene)
  // avion.rotateZ(Math.PI)
  avion.position.y = 15
  // controls.target = avion.position
  // avion.castShadow = true
  avion.receiveShadow = true
  scene.add(avion)
  animate()
})

function animate() {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}