import { scene, renderer, camera, clock } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { createFloor } from '/core/ground.js'
import { PartisanPlayer } from '/core/actor/derived/ww2/Partisan.js'
import GUI from '/core/io/GUI.js'

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
