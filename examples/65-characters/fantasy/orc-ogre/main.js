import { scene, renderer, camera, createOrbitControls, clock } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { createGround } from '/core/ground.js'
import { OrcOgrePlayer } from '/core/actor/derived/fantasy/OrcOgre.js'
import GUI from '/core/io/GUI.js'

createOrbitControls()

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new OrcOgrePlayer()
scene.add(player.mesh)

new GUI({ scoreTitle: '', player })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
