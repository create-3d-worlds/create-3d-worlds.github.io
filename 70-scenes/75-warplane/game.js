import * as THREE from '/node_modules/three125/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import Avion from './Avion.js'
import {createFloor} from '/utils/floor.js'

/**
 * TODO:
 * dodati sunce
 * dodati drveće
 * srediti kontrole: skretanje, spuštanje, dizanje, brzinu
 */

let avion
let mouseDown = false

const controls = createOrbitControls()
const ground = createFloor(10000)
scene.background = new THREE.Color(0x87CEEB) // 0x3299CC
scene.add(ground)

/* UPDATE */

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  avion.normalizePlane()
  avion.position.z += .5
  if (!mouseDown)
    camera.position.lerp({ ...avion.position, z: avion.position.z - 100 }, 0.05)
  // camera.lookAt(avion.position)
  renderer.render(scene, camera)
}

/* LOAD */

new ColladaLoader().load('/assets/models/s-e-5a/model.dae', collada => {
  avion = new Avion(collada.scene)
  avion.rotateZ(Math.PI)
  avion.position.y = 50
  controls.target = avion.position
  camera.position.set(-68, 100, -90)
  scene.add(avion)
  animate()
})

/* EVENTS */

document.body.onmousedown = () => {
  mouseDown = true
}
document.body.onmouseup = () => {
  mouseDown = false
}

