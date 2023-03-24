import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { SorceressPlayer } from '/utils/actors/fantasy/Sorceress.js'

createOrbitControls()

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new SorceressPlayer()
scene.add(player.mesh)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
