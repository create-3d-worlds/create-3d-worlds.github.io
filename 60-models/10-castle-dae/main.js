import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { initLights } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

initLights()

const controls = createOrbitControls()
camera.position.set(0, 2, 10)

const { mesh } = await loadModel({ file: 'tvrdjava.dae', size: 10, rot: { angle: Math.PI / 2, axis: [0, 1, 0] } })
scene.add(mesh)

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  controls.update()
  renderer.render(scene, camera)
}()
