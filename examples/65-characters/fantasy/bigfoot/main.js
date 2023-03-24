import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { BigfootPlayer } from '/utils/actors/fantasy/Bigfoot.js'

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new BigfootPlayer()
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
