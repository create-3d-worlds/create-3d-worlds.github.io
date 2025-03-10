import { scene, renderer, camera, createOrbitControls, clock } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { createFloor } from '/core/ground.js'
import { GermanMachineGunnerPlayer } from '/core/actor/derived/ww2/GermanMachineGunner.js'
import GUI from '/core/io/GUI.js'

scene.add(createSun())
scene.add(createFloor({ size: 100 }))

const player = new GermanMachineGunnerPlayer()
scene.add(player.mesh)

const controls = await createOrbitControls()
controls.target = player.mesh.position

new GUI({ scoreTitle: '', player })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
