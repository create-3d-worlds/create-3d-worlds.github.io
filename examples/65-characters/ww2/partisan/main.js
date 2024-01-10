import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createFloor } from '/utils/ground.js'
import { PartisanPlayer } from '/utils/actor/derived/ww2/Partisan.js'
import GUI from '/utils/io/GUI.js'

scene.add(createSun())
scene.add(createFloor({ size: 100 }))

const player = new PartisanPlayer({ camera, useScreen: true })
scene.add(player.mesh)

new GUI({ scoreTitle: '', player })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
