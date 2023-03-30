import { camera, scene, renderer, createOrbitControls, setBackground, clock } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createMoon } from '/utils/light.js'
import { getAllCoords } from '/utils/helpers.js'
import { createTombstone } from '/utils/geometry/shapes.js'
import { GhostAI } from '/utils/actor/horror/Ghost.js'
import { ResistanceFighterPlayer } from '/utils/actor/ww2/ResistanceFighter.js'

const mapSize = 100
const npcs = []

setBackground(0x070b34)

createOrbitControls()
camera.position.set(15, 5, 30)
camera.lookAt(scene.position)

scene.add(createMoon({ intensity: .5, position: [15, 30, -30] }))
scene.add(createGround({ size: mapSize }))

const solids = []
const coords = getAllCoords({ mapSize, fieldSize: 1 })

for (let i = 0; i < 60; i++) {
  const { x, z } = coords.pop()
  const tombstone = createTombstone({ x, z })
  solids.push(tombstone)
}

for (let i = 0; i < 30; i++) {
  const npc = new GhostAI({ coords, mapSize })
  npcs.push(npc)
  solids.push(npc.mesh)
}

const player = new ResistanceFighterPlayer({ camera, solids })
scene.add(player.mesh)
scene.add(...solids)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  npcs.forEach(npc => npc.update(delta))

  renderer.render(scene, camera)
}()