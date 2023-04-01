import { camera, scene, renderer, setBackground, clock } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createMoon } from '/utils/light.js'
import { getShuffledCoords, sample, getMesh } from '/utils/helpers.js'
import { createTombstone } from '/utils/geometry/shapes.js'
import { GhostAI } from '/utils/actor/horror/Ghost.js'
import { ResistanceFighterPlayer } from '/utils/actor/ww2/ResistanceFighter.js'
import { Smoke } from '/utils/classes/Particles.js'
import { loadModel } from '/utils/loaders.js'

const mapSize = 100
const npcs = []
const solids = []
const coords = getShuffledCoords({ mapSize, fieldSize: 1, emptyCenter: 1 })

let last = Date.now()

/* INIT */

const particles = new Smoke({ size: 1, num: 100, minRadius: 0, maxRadius: .5 })
scene.add(particles.mesh)

setBackground(0x070b34)

scene.add(createMoon({ intensity: .5, position: [15, 30, -30] }))
scene.add(createGround({ size: mapSize }))

for (let i = 0; i < 60; i++) {
  const { x, z } = coords.pop()
  const tombstone = createTombstone({ x, z })
  solids.push(tombstone)
}

const { mesh } = await loadModel({ file: 'nature/dead-tree/model.glb', size: 5 })

for (let i = 0; i < 10; i++) {
  const { x, z } = coords.pop()
  const tree = mesh.clone()
  tree.position.set(x, 0, z)
  const scale = Math.random() * 1 + 1
  tree.scale.set(scale, scale, scale)
  tree.rotateY(Math.random() * Math.PI)
  getMesh(tree).material.color.setHex(0x000000)
  solids.push(tree)
}

for (let i = 0; i < 30; i++) {
  const ghost = new GhostAI({ coords, mapSize })
  npcs.push(ghost)
  scene.add(ghost.mesh)
}

const player = new ResistanceFighterPlayer({ camera, solids })
player.cameraFollow.distance = 1.5
scene.add(player.mesh)
scene.add(...solids)
// player.position.set(0, 0, 0)

/* FUNCTIONS */

const zombies = ['GothGirl', 'ZombieBarefoot', 'ZombieCop', 'ZombieDoctor', 'ZombieGuard']

async function spawnZombie(interval) {
  if (Date.now() - last >= interval) {
    last = Date.now()

    const name = sample(zombies)
    const obj = await import(`/utils/actor/horror/${name}.js`)
    const ZombieClass = obj[name + 'AI']
    const coord = sample(coords)
    const zombie = new ZombieClass({ mapSize, target: player.mesh, solids, coords: [coord] })
    particles.reset({ pos: coord })
    player.addSolids(zombie.mesh)
    scene.add(zombie.mesh)
    npcs.push(zombie)
  }
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  player.update(delta)
  npcs.forEach(npc => npc.update(delta))
  spawnZombie(10000)

  particles.update({ delta, min: -1, max: 0, minVelocity: .2, maxVelocity: .5, loop: false })

  renderer.render(scene, camera)
}()