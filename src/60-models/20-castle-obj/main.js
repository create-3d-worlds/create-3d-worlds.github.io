import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'
import { loadModel } from '/utils/loaders.js'

createOrbitControls()
initLights()

const { mesh } = await loadModel({ file: 'zamak.obj' })
mesh.position.y = -95
scene.add(mesh)

/** LOOP **/

const update = () => {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}

update()
