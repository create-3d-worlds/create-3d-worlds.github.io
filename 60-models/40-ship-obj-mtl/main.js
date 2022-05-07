import { scene, camera, renderer, createOrbitControls, initLights, hemLight } from '/utils/scene.js'
import { loadObject } from '/utils/loaders.js'

hemLight({ intensity: 2 })
initLights()
createOrbitControls()

const object = await loadObject({ obj: 'BlackPearl/BlackPearl.obj', mtl: 'BlackPearl/BlackPearl.mtl' })
object.rotateY(Math.PI / 2)
scene.add(object)

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()
