/* global THREE */
import scene from './scene/scene.js'
import camera from './scene/camera.js'
import renderer from './scene/renderer.js'
import controls from './scene/controls.js'
import ground from './actors/ground.js'
import Avion from './actors/Avion.js'

const mousePos = { x: 0, y: 0 }
let avion

/* FUNCTIONS */

const updateMousePos = e => {
  mousePos.x = -1 + (e.clientX / window.innerWidth) * 2
  mousePos.y = 1 - (e.clientY / window.innerHeight) * 2
}

const update = () => {
  requestAnimationFrame(update)
  controls.update()
  ground.rotate()
  avion.normalizePlane()
  camera.lookAt(avion.position)
  renderer.render(scene, camera)
}

/* EVENTS */

new THREE.ColladaLoader().load('assets/me-109/model.dae', collada => {
  avion = new Avion(collada.scene)
  scene.add(avion, ground)
  update()
})

document.addEventListener('mousemove', updateMousePos)
