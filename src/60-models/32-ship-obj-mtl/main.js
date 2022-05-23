import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { initLights, hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

hemLight({ intensity: 2 })
initLights()
createOrbitControls()

const { mesh } = await loadModel(
  { file: 'ship-pirate/BlackPearl.obj', mtl: 'ship-pirate/BlackPearl.mtl', rot: { axis: [0, 1, 0], angle: Math.PI / 2 } })
scene.add(mesh)

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()
