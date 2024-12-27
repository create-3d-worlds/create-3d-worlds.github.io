import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { loadModel } from '/core/loaders.js'

scene.add(createSun())

const controls = await createOrbitControls()
camera.position.set(0, 2, 12)

const leftCastle = await loadModel({ file: 'building/castle/castle-fortress.fbx', texture: 'terrain/concrete.jpg', size: 10 })
scene.add(leftCastle)
leftCastle.position.x = -10

const rightCastle = await loadModel({ file: 'building/castle/magic-castle.fbx', texture: 'terrain/concrete.jpg', size: 10 })
scene.add(rightCastle)
rightCastle.position.x = 10

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  controls.update()
  renderer.render(scene, camera)
}()
