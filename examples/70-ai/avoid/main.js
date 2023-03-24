import { camera, scene, renderer, createOrbitControls, setBackground, clock } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createMoon } from '/utils/light.js'
import { createBox } from '/utils/geometry.js'
import { randomInSquare } from '/utils/helpers.js'
import { createTombstone } from '/utils/geometry/shapes.js'
import { GhostAI } from '/utils/actors/horror/Ghost.js'

const mapSize = 100
const npcs = []

setBackground(0x070b34)

createOrbitControls()
camera.position.set(15, 5, 30)
camera.lookAt(scene.position)

scene.add(createMoon({ intensity: .5, position: [15, 30, -30] }))
scene.add(createGround({ size: mapSize }))

const obstacles = []

for (let i = 0; i < 3; i++) {
  const tomb = createBox({ width: 2, height: 3, depth: 2, file: 'tomb.jpg' })
  const { x, z } = randomInSquare(mapSize)
  tomb.position.set(x, tomb.position.y, z)
  obstacles.push(tomb)
  scene.add(tomb)
}

for (let i = 0; i < 50; i++) {
  const { x, z } = randomInSquare(mapSize)
  const tombstone = createTombstone({ x, y: -1, z })
  obstacles.push(tombstone)
  scene.add(tombstone)
}

for (let i = 0; i < 50; i++) {
  const npc = new GhostAI({ mapSize, solids: obstacles })
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