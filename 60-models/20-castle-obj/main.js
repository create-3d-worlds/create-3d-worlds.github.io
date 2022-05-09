import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'
import { loadObj } from '/utils/loaders.js'

createOrbitControls()
initLights()

const model = await loadObj({ obj: 'zamak.obj' })
model.position.y = -95
scene.add(model)

/** LOOP **/

const update = () => {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}

update()
