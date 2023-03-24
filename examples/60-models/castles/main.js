import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

scene.add(createSun())

const controls = createOrbitControls()
camera.position.set(0, 2, 12)

const { mesh: leftCastle } = await loadModel({ file: 'building/castle/fortress.fbx', shouldAdjust: true, size: 10 })
scene.add(leftCastle)
leftCastle.position.x = -10

const { mesh: rightCastle } = await loadModel({ file: 'building/castle/magic-castle.fbx', size: 10, shouldAdjust: true })
scene.add(rightCastle)
rightCastle.position.x = 10

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  controls.update()
  renderer.render(scene, camera)
}()
