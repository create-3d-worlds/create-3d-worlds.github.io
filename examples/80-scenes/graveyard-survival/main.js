import * as THREE from 'three'
import { camera, scene, createToonRenderer, setBackground, clock } from '/utils/scene.js'
import { Spinner } from '/utils/loaders.js'
import { createGround } from '/utils/ground.js'
import { createMoon, orbiting } from '/utils/light.js'
import { getEmptyCoords, sample } from '/utils/helpers.js'
import { createTombstone } from '/utils/geometry/shapes.js'
import { Smoke } from '/utils/Particles.js'
import Score from '/utils/io/Score.js'

const spinner = new Spinner()
const renderer = await createToonRenderer()

const moonSpeed = .005
const totalTime = 300
const mapSize = 100
const npcs = []
const solids = []

let last = Date.now()
let time = 0
let player

/* INIT */

const score = new Score({ title: 'Zombies killed', subtitle: 'Time left' })
const coords = getEmptyCoords({ mapSize, fieldSize: 1, emptyCenter: 1 })

const particles = new Smoke({ size: 1, num: 100, minRadius: 0, maxRadius: .5 })

setBackground(0x202030)

const moon = createMoon({ intensity: .5, pos: [15, 25, -30] })
scene.add(moon)
scene.add(createGround({ size: mapSize }))

for (let i = 0; i < 60; i++) {
  const tombstone = createTombstone({ pos: coords.pop() })
  solids.push(tombstone)
  scene.add(tombstone)
}

/* FUNCTIONS */

const zombies = ['GothGirl', 'ZombieBarefoot', 'ZombieCop', 'ZombieDoctor', 'ZombieGuard']

async function spawnZombie(interval) {
  if (Date.now() - last >= interval) {
    last = Date.now()

    const name = sample(zombies)
    const obj = await import(`/utils/actor/derived/horror/${name}.js`)
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
  renderer.render(scene, camera)
  if (spinner.loading) return

  const delta = clock.getDelta()
  time += delta

  const timeLeft = Math.ceil(totalTime - time)
  const isNight = timeLeft >= 0

  const moonTime = isNight ? time * moonSpeed : (time - totalTime) * moonSpeed
  orbiting(moon, moonTime, 150, 1)

  if (isNight) {
    spawnZombie(10000)
    const kills = player.enemies.filter(mesh => mesh.userData.energy <= 0)
    if (!player.dead) score.render(kills.length, timeLeft)
    if (player.dead) score.renderText('You have been killed at the cursed graveyard.')
  } else {
    moon.material.color = new THREE.Color(0xFCE570)
    moon.scale.set(2, 2, 2)
    scene.background.lerp(new THREE.Color(0x7ec0ee), delta * .2)
    if (!player.dead) score.renderText('Victory!<br>You met the morning at the cursed graveyard.')
  }

  player.update(delta)
  npcs.forEach(npc => {
    npc.update(delta)
    if (!isNight) npc.hitAmount = 100
  })
  particles.update({ delta, min: -1, max: 0, minVelocity: .2, maxVelocity: .5, loop: false })
}()

/* LAZY LOAD */

const obj = await import('/utils/objects/DeadTree.js')
for (let i = 0; i < 10; i++) {
  const tree = new obj.default({ pos: coords.pop(), scale: Math.random() * 1 + 1, rotateY: Math.random() * Math.PI })
  solids.push(tree.mesh)
  scene.add(tree.mesh)
}

const { GhostAI } = await import('/utils/actor/derived/horror/Ghost.js')
for (let i = 0; i < 30; i++) {
  const ghost = new GhostAI({ pos: coords.pop(), mapSize })
  npcs.push(ghost)
  scene.add(ghost.mesh)
}

const { ResistanceFighterPlayer } = await import('/utils/actor/derived/ww2/ResistanceFighter.js')
player = new ResistanceFighterPlayer({ camera, solids })
scene.add(player.mesh)

scene.add(particles.mesh)
score.renderTempText('Survive until morning!')

spinner.hide()