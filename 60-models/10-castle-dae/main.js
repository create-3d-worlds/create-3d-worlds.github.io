import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'

const scale = 0.1

initLights()

createOrbitControls()
camera.position.set(3, 2, 10)

const loader = new ColladaLoader()
loader.load('/assets/models/tvrdjava.dae', data => {
  const model = data.scene
  model.scale.set(scale, scale, scale)
  model.rotateX(Math.PI / 2)
  scene.add(model)
})

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
