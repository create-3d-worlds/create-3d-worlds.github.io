import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { initLights } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

initLights()

const controls = createOrbitControls()
camera.position.set(0, 2, 12)

const { mesh: leftCastle } = await loadModel({ file: 'castle/fortress.dae', shouldAdjust: true, size: 10, rot: { angle: Math.PI * .5, axis: [1, 0, 0] } })
scene.add(leftCastle)
leftCastle.position.x = -10

const { mesh: rightCastle } = await loadModel({ file: 'castle/magic-castle.obj', size: 10, shouldAdjust: true })
scene.add(rightCastle)
rightCastle.position.x = 10

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  controls.update()
  renderer.render(scene, camera)
}()
