import { ColladaLoader } from '/node_modules/three119/examples/jsm/loaders/ColladaLoader.js'

import scene from './scene/scene.js'
import camera from './scene/camera.js'
import renderer from './scene/renderer.js'
import controls from './scene/controls.js'
import ground from './actors/ground.js'
import Avion from './actors/Avion.js'

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
