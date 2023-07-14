import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { SoldierPlayer } from '/utils/actor/derived/ww2/Soldier.js'
import GUI from '/utils/io/GUI.js'

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new SoldierPlayer()
scene.add(player.mesh)

const controls = await createOrbitControls()
controls.target = player.mesh.position

new GUI({ scoreTitle: '', actions: player.actions })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
