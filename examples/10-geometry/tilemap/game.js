import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { meshFromTilemap } from '/utils/mazes.js'
import { createGround } from '/utils/ground.js'
import { hemLight } from '/utils/light.js'

export const tilemap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 1, 1, 1, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 3],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

hemLight()

scene.add(createGround({ file: 'terrain/ground.jpg', size: 100 }))

const map = meshFromTilemap({ tilemap, texture: 'terrain/concrete.jpg' })
scene.add(map)

const controls = createOrbitControls()

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()
