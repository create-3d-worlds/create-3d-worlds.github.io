import { scene, renderer, camera, clock, setBackground } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { sample } from '/utils/helpers.js'
import { hemLight, lightningStrike } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { Rain } from '/utils/Particles.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'
import { GermanMachineGunnerAI } from '/utils/actor/derived/ww2/GermanMachineGunner.js'
import { SSSoldierAI } from '/utils/actor/derived/ww2/SSSoldier.js'
import { NaziOfficerAI } from '/utils/actor/derived/ww2/NaziOfficer.js'
import { GermanFlameThrowerAI } from '/utils/actor/derived/ww2/GermanFlameThrower.js'

import Maze from '/utils/mazes/Maze.js'
import { truePrims } from '/utils/mazes/algorithms.js'

import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js'
const stats = new Stats()
document.body.appendChild(stats.dom)

const light = hemLight({ intensity: .75 })
setBackground(0x070b34)
scene.add(createGround({ file: 'terrain/ground.jpg' }))

const rain = new Rain()
scene.add(rain.mesh)

const maze = new Maze(8, 8, truePrims, 10)
const walls = maze.toTiledMesh({ texture: 'terrain/concrete.jpg' })
const coords = maze.getEmptyCoords(true)

const solids = [walls]

/* ACTORS */

const enemyClasses = [GermanFlameThrowerAI, GermanMachineGunnerAI, GermanMachineGunnerAI, GermanMachineGunnerAI, SSSoldierAI, SSSoldierAI, SSSoldierAI, NaziOfficerAI]

const player = new FPSPlayer({ camera, pos: coords.pop() })
player.putInMaze(maze)
scene.add(player.mesh)

const enemies = []
for (let i = 0; i < 10; i++) {
  // možda dinamički import?
  const EnemyClass = sample(enemyClasses)
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh })
  enemies.push(enemy)
  solids.push(enemy.mesh)
}

const bunker = await loadModel({ file: 'building/bunker.fbx', texture: 'terrain/concrete.jpg', size: 2.5 })
bunker.position.copy(coords.pop())
solids.push(bunker)

player.addSolids(solids)
enemies.forEach(enemy => enemy.addSolids(solids))

scene.add(...solids)

/* LOOP */

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  if (!document.pointerLockElement) return
  const delta = clock.getDelta()

  stats.update()

  player.update(delta)
  enemies.forEach(enemy => enemy.update(delta))
  rain.update({ delta, pos: player.position })
  if (Math.random() > .997) lightningStrike(light)
})