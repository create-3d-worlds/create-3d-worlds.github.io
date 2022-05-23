import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'
import { loadModel } from '/utils/loaders.js'

let currentId

initLights()

camera.position.z = 200
const controls = createOrbitControls()

selectModel(document.querySelector('#select-model').value)

/** FUNCTIONS **/

async function selectModel(file) {
  const { mesh } = await loadModel({ file, shouldCenter: true, shouldAdjustHeight: true })
  scene.remove(scene.getObjectById(currentId))
  scene.add(mesh)
  controls.target = mesh.position
  currentId = mesh.id
}

/** EVENTS **/

document.querySelector('#select-model').addEventListener('change', e => {
  selectModel(e.target.value)
})

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  controls.update()
  renderer.render(scene, camera)
}()
