import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { ZombieDoctorPlayer } from '/utils/actor/derived/horror/ZombieDoctor.js'
import GUI from '/utils/io/GUI.js'

createOrbitControls()

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new ZombieDoctorPlayer()
scene.add(player.mesh)

new GUI({ scoreTitle: '', actions: player.actions })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
