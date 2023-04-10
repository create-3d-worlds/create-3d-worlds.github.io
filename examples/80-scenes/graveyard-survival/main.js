import { camera, scene, renderer, setBackground, clock } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createMoon } from '/utils/light.js'
import { getShuffledCoords, sample } from '/utils/helpers.js'
import { createTombstone } from '/utils/geometry/shapes.js'
import { GhostAI } from '/utils/actor/child/horror/Ghost.js'
import { ResistanceFighterPlayer } from '/utils/actor/child/ww2/ResistanceFighter.js'
import { Smoke } from '/utils/classes/Particles.js'
import DeadTree from '/utils/actor/child/DeadTree.js'

const mapSize = 100
const npcs = []
const solids = []
const coords = getShuffledCoords({ mapSize, fieldSize: 1, emptyCenter: 1 })

let last = Date.now()

/* INIT */

const particles = new Smoke({ size: 1, num: 100, minRadius: 0, maxRadius: .5 })
scene.add(particles.mesh)

setBackground(0x070b34)

scene.add(createMoon({ intensity: .5, pos: [15, 30, -30] }))
scene.add(createGround({ size: mapSize }))

for (let i = 0; i < 60; i++) {
  const tombstone = createTombstone({ pos: coords.pop() })
  solids.push(tombstone)
}

for (let i = 0; i < 10; i++) {
  const tree = new DeadTree({ pos: coords.pop(), scale: Math.random() * 1 + 1, rotateY: Math.random() * Math.PI })
  solids.push(tree.mesh)
}

for (let i = 0; i < 30; i++) {
  const ghost = new GhostAI({ pos: coords.pop(), mapSize })
  npcs.push(ghost)
  scene.add(ghost.mesh)
}

const player = new ResistanceFighterPlayer({ camera, solids })
scene.add(player.mesh)
scene.add(...solids)

/* FUNCTIONS */

const zombies = ['GothGirl', 'ZombieBarefoot', 'ZombieCop', 'ZombieDoctor', 'ZombieGuard']

async function spawnZombie(interval) {
  if (Date.now() - last >= interval) {
    last = Date.now()

    const name = sample(zombies)
    const obj = await import(`/utils/actor/child/horror/${name}.js`)
    const ZombieClass = obj[name + 'AI']
    const pos = sample(coords)
    const zombie = new ZombieClass({ mapSize, target: player.mesh, solids, pos })
    particles.reset({ pos })
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
  particles.update({ delta, min: -1, max: 0, minVelocity: .2, maxVelocity: .5, loop: false })
  spawnZombie(10000)

  renderer.render(scene, camera)
}()