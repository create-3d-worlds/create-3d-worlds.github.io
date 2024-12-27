import { scene, camera, clock, createToonRenderer } from '/core/scene.js'
import { createTrees } from '/core/geometry/trees.js'
import Avatar from '/core/actor/Avatar.js'

import { createGround } from '/core/ground.js'
import { createSun } from '/core/light.js'

const renderer = await createToonRenderer()

scene.add(createGround({ file: 'terrain/ground.jpg' }))
const sun = createSun()
scene.add(sun)

const player = new Avatar({ camera })

scene.add(player.mesh, createTrees())

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
