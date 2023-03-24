import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { IronGiantPlayer } from '/utils/actors/fantasy/IronGiant.js'

createOrbitControls()
camera.position.set(0, 4, 8)

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new IronGiantPlayer()
scene.add(player.mesh)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
