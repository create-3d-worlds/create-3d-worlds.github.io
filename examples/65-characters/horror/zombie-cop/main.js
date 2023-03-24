import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { ZombieCopPlayer } from '/utils/actors/horror/ZombieCop.js'

createOrbitControls()

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new ZombieCopPlayer()
scene.add(player.mesh)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
