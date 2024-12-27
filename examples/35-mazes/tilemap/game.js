import { scene, renderer, camera, createOrbitControls } from '/core/scene.js'
import { meshFromTilemap } from '/core/mazes/index.js'
import { createGround } from '/core/ground.js'
import { hemLight } from '/core/light.js'

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

const controls = await createOrbitControls()

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()
