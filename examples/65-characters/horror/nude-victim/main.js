import { scene, renderer, camera, createOrbitControls, setBackground, clock } from '/utils/scene.js'
import { createMoon } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { NudeVictimPlayer } from '/utils/actor/derived/horror/NudeVictim.js'
import { ZombieCopAI } from '/utils/actor/derived/horror/ZombieCop.js'
import GUI from '/utils/io/GUI.js'

createOrbitControls()
setBackground(0)

scene.add(createMoon())
scene.add(createGround({ size: 100 }))

const player = new NudeVictimPlayer()
scene.add(player.mesh)

const zombie = new ZombieCopAI({ target: player.mesh, pos: [0, 0, 5] })
scene.add(zombie.mesh)

new GUI({ scoreTitle: '', player, controls: { Enter: 'terrified', V: 'Agonizing' } })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  player.update(delta)
  zombie.update(delta)
  renderer.render(scene, camera)
}()
