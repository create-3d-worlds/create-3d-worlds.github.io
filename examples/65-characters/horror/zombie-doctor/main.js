import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { ZombieDoctorPlayer } from '/utils/actors/horror/ZombieDoctor.js'

createOrbitControls()

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new ZombieDoctorPlayer()
scene.add(player.mesh)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
