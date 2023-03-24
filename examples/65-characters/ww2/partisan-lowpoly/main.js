import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { PartisanLowpolyPlayer } from '/utils/actors/ww2/PartisanLowpoly.js'

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new PartisanLowpolyPlayer({ useJoystick: true }) // camera
scene.add(player.mesh)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
