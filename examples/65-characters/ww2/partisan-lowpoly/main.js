import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createFloor } from '/utils/ground.js'
import { PartisanLowpolyPlayer } from '/utils/actor/derived/ww2/PartisanLowpoly.js'
import GUI from '/utils/io/GUI.js'

scene.add(createSun())
scene.add(createFloor({ size: 100 }))

const player = new PartisanLowpolyPlayer({ useScreen: true }) // camera
scene.add(player.mesh)

new GUI({ scoreTitle: '', player })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
