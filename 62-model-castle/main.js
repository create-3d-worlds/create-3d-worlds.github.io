import { ColladaLoader } from '../node_modules/three/examples/jsm/loaders/ColladaLoader.js'
import { scene, renderer, camera, createOrbitControls} from '../utils/scene.js'
import {createHillyTerrain} from '../utils/createHillyTerrain.js'
import {createWater} from '../utils/floor.js'

const terrain = createHillyTerrain()
scene.add(terrain)
scene.add(createWater())

camera.position.set(100, 100, 100)
createOrbitControls()

const loader = new ColladaLoader()

loader.load('models/castle.dae', data => {
  const model = data.scene
  console.log(model)
  model.rotateX(Math.PI / 2)
  model.scale.set(4, 4, 4)
  scene.add(model)
})

/* INIT */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
