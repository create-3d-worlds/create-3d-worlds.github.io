import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'

createOrbitControls()
initLights()

const loader = new OBJLoader()
loader.load('/assets/models/zamak.obj', model => {
  model.position.y = -95
  scene.add(model)
})

/** LOOP **/

const update = () => {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}

update()
