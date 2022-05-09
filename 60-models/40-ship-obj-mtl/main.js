import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { initLights, hemLight } from '/utils/light.js'
import { loadObj } from '/utils/loaders.js'

hemLight({ intensity: 2 })
initLights()
createOrbitControls()

const object = await loadObj({ obj: 'ship/BlackPearl.obj', mtl: 'ship/BlackPearl.mtl', rotateY: Math.PI / 2 })
scene.add(object)

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()
