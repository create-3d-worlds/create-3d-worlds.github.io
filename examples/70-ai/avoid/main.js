import { camera, scene, renderer, createOrbitControls, setBackground, clock } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createMoon } from '/utils/light.js'
import { getAllCoords } from '/utils/helpers.js'
import { createTombstone } from '/utils/geometry/shapes.js'
import { GhostAI } from '/utils/actor/horror/Ghost.js'

const mapSize = 100
const npcs = []

setBackground(0x070b34)

createOrbitControls()
camera.position.set(15, 5, 30)
camera.lookAt(scene.position)

scene.add(createMoon({ intensity: .5, position: [15, 30, -30] }))
scene.add(createGround({ size: mapSize }))

const obstacles = []
const coords = getAllCoords({ mapSize, fieldSize: 1 })

for (let i = 0; i < 60; i++) {
  const { x, z } = coords.pop()
  const tombstone = createTombstone({ x, y: -1, z })
  obstacles.push(tombstone)
  scene.add(tombstone)
}

for (let i = 0; i < 30; i++) {
  const npc = new GhostAI({ coords, solids: obstacles })
  npcs.push(npc)
  scene.add(npc.mesh)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  npcs.forEach(npc => npc.update(delta))

  renderer.render(scene, camera)
}()