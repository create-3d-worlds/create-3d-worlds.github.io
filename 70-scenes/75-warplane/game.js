import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { createFullScene, renderer, createOrbitControls} from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import Avion from './Avion.js'

let avion
let mouseDown = false
const scene = createFullScene({ color:0xFFC880 }, undefined, undefined, { color: 0xE5C5AB })
scene.add(createTerrain(4000, 200))

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.set(0, 10, 250)
const controls = createOrbitControls(camera)

/* UPDATE */

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  avion.normalizePlane()
  avion.position.z -= .5
  if (!mouseDown)
    camera.position.lerp({ ...avion.position, z: avion.position.z + 150 }, 0.05)
  // camera.lookAt(avion.position)
  renderer.render(scene, camera)
}

/* LOAD */

new ColladaLoader().load('/assets/models/s-e-5a/model.dae', collada => {
  avion = new Avion(collada.scene)
  avion.position.y = 15
  scene.getObjectByName('sunLight').target = avion
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

