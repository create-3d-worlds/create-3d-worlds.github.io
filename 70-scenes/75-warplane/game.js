import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { createFullScene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import {createTerrain} from '/utils/ground.js'
import Avion from './Avion.js'

/**
 * TODO:
 * dodati sunce
 * dodati drveće
 * srediti kontrole: skretanje, spuštanje, dizanje, brzinu
 */

let avion
let mouseDown = false
let scene

// const scene = createFullScene({ color:0xdba262 })

const controls = createOrbitControls()

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

  scene = createFullScene(undefined, undefined, { target: avion })
  scene.add(createTerrain(4000, 200))
  scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)

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

