import { scene, renderer, camera, clock, setBackground } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { sample } from '/utils/helpers.js'
import { hemLight, lightningStrike } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { Rain } from '/utils/classes/Particles.js'
import FPSPlayer from '/utils/player/FPSPlayer.js'
import { TankAI } from '/utils/actors/Tank.js'
import { GermanMachineGunnerAI } from '/utils/actors/ww2/GermanMachineGunner.js'
import { SSSoldierAI } from '/utils/actors/ww2/SSSoldier.js'
import { NaziOfficerAI } from '/utils/actors/ww2/NaziOfficer.js'
import { GermanFlameThrowerAI } from '/utils/actors/ww2/GermanFlameThrower.js'

import Maze from '/utils/mazes/Maze.js'
import { truePrims } from '/utils/mazes/algorithms.js'

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

const player = new FPSPlayer({ camera, coords, pointerLockId: 'instructions' })
player.putInMaze(maze)
scene.add(player.mesh)

const enemies = []
for (let i = 0; i < 20; i++) {
  const EnemyClass = sample(enemyClasses)
  const enemy = new EnemyClass({ coords, target: player.mesh })
  enemies.push(enemy)
  solids.push(enemy.mesh)
}

/* OBJECTS */

const tank = new TankAI({ coords })
solids.push(tank.mesh)

const { mesh: bunker } = await loadModel({ file: 'building/bunker.fbx', texture: 'terrain/concrete.jpg', size: 2.5 })
bunker.position.copy(coords.pop())
solids.push(bunker)

player.addSolids(solids)
enemies.forEach(enemy => enemy.addSolids(solids))
tank.addSolids([walls, bunker])

scene.add(...solids)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  if (!document.pointerLockElement) return
  const delta = clock.getDelta()

  player.update(delta)
  enemies.forEach(enemy => enemy.update(delta))
  rain.update({ delta, pos: player.position })
  if (Math.random() > .997) lightningStrike(light)
  tank.update(delta)
}()

