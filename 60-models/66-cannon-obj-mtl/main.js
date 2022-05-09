import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { loadObj } from '/utils/loaders.js'

hemLight({ intensity: 2 })

const controls = createOrbitControls()

const object = await loadObj({ obj: 'cannon/cannon.obj', mtl: 'cannon/cannon.mtl' })
scene.add(object)
controls.target = object.position

/* LOOP */

void function render() {
  // const delta = clock.getDelta()
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()

