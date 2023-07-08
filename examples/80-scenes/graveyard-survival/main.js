import * as THREE from 'three'
import { camera, scene, createToonRenderer, setBackground } from '/utils/scene.js'
import { Spinner } from '/utils/loaders.js'
import { createGround } from '/utils/ground.js'
import { createMoon, orbiting } from '/utils/light.js'
import { getEmptyCoords, sample } from '/utils/helpers.js'
import { createTombstone } from '/utils/geometry/shapes.js'
import GameLoop from '/utils/GameLoop.js'

const spinner = new Spinner()
const renderer = await createToonRenderer()

const moonSpeed = .005
const totalTime = 300
const mapSize = 100
const npcs = []
const solids = []

let last = Date.now()

/* INIT */

const coords = getEmptyCoords({ mapSize, fieldSize: 1, emptyCenter: 1 })

setBackground(0x202030)

const moon = createMoon({ intensity: .5, pos: [15, 25, -30] })
scene.add(moon)
scene.add(createGround({ size: mapSize }))

for (let i = 0; i < 60; i++) {
  const tombstone = createTombstone({ pos: coords.pop() })
  solids.push(tombstone)
  scene.add(tombstone)
}

renderer.render(scene, camera)

/* LAZY LOAD */

const GUI = await import('/utils/io/GUI.js')
const gui = new GUI.default({ scoreTitle: 'Zombies killed', subtitle: 'Time left' })

const DeadTree = await import('/utils/objects/DeadTree.js')
for (let i = 0; i < 10; i++) {
  const tree = new DeadTree.default({ pos: coords.pop(), scale: Math.random() * 1 + 1, rotateY: Math.random() * Math.PI })
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
const player = new ResistanceFighterPlayer({ camera, solids })
scene.add(player.mesh)

const { Smoke } = await import('/utils/Particles.js')
const particles = new Smoke({ size: 1, num: 100, minRadius: 0, maxRadius: .5 })
scene.add(particles.mesh)

spinner.hide()

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

const loop = new GameLoop((delta, time) => {
  renderer.render(scene, camera)
  const timeLeft = Math.ceil(totalTime - time)
  const isNight = timeLeft >= 0

  const moonTime = isNight ? time * moonSpeed : (time - totalTime) * moonSpeed
  orbiting(moon, moonTime, 150, 1)

  if (isNight) {
    spawnZombie(10000)
    const kills = player.enemies.filter(mesh => mesh.userData.energy <= 0)
    if (!player.dead) gui.renderScore(kills.length, timeLeft)
    if (player.dead) gui.renderText('You have been killed at the cursed graveyard.')
  } else {
    moon.material.color = new THREE.Color(0xFCE570)
    moon.scale.set(2, 2, 2)
    scene.background.lerp(new THREE.Color(0x7ec0ee), delta * .2)
    if (!player.dead) gui.renderText('Victory!<br>You met the morning at the cursed graveyard.')
  }

  player.update(delta)
  npcs.forEach(npc => {
    npc.update(delta)
    if (!isNight) npc.hitAmount = 100
  })
  particles.update({ delta, min: -1, max: 0, minVelocity: .2, maxVelocity: .5, loop: false })
}, false)

gui.showGameScreen({ title: 'Survive until morning', subtitle: 'Meet the morning at the cursed graveyard.', callback: () => loop.start() })