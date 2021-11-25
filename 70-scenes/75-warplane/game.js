import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { createFullScene, renderer, createOrbitControls} from '/utils/scene.js'
import Avion from './Avion.js'

/**
 * TODO:
 * srediti komande: skretanje, spuštanje, dizanje, brzinu
 * dodati sunce
 * dodati drveće
 * probati pticu
 */

let avion
let mouseDown = false
let scene

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.set(0, 10, 250)
const controls = createOrbitControls(camera)

/* UPDATE */

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  // avion.normalizePlane()
  avion.position.z -= .5
  if (!mouseDown)
    camera.position.lerp({ ...avion.position, z: avion.position.z + 150 }, 0.05)
  // camera.lookAt(avion.position)
  renderer.render(scene, camera)
}

/* LOAD */

new ColladaLoader().load('/assets/models/s-e-5a/model.dae', collada => {
  avion = new Avion(collada.scene)
  avion.scale.set(.2, .2, .2)
  avion.position.y = 15

  scene = createFullScene({ color:0xFFC880 }, undefined, { target: avion })
  scene.fog = new THREE.Fog(0xFFC880, 1000, 3000)

  controls.target = avion.position
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

