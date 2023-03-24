import { scene, renderer, camera, createOrbitControls, clock, setBackground } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { GermanFlameThrowerPlayer } from '/utils/actors/ww2/GermanFlameThrower.js'

scene.add(createSun())
scene.add(createGround({ size: 100 }))
setBackground(0x000000)

const player = new GermanFlameThrowerPlayer()
scene.add(player.mesh)

const controls = createOrbitControls()
controls.target = player.mesh.position

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
