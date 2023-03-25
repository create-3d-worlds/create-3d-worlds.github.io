import { scene, renderer, camera, clock, setBackground } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { sample } from '/utils/helpers.js'
import { getEmptyCoords, meshFromTilemap } from '/utils/mazes.js'
import { hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { Snow } from '/utils/classes/Particles.js'
import FPSPlayer from '/utils/player/FPSPlayer.js'
import { TankAI } from '/utils/actors/Tank.js'
import { GermanMachineGunnerAI } from '/utils/actors/ww2/GermanMachineGunner.js'
import { SSSoldierAI } from '/utils/actors/ww2/SSSoldier.js'
import { NaziOfficerAI } from '/utils/actors/ww2/NaziOfficer.js'
import { GermanFlameThrowerAI } from '/utils/actors/ww2/GermanFlameThrower.js'

import Maze from '/utils/mazes/Maze.js'
import { truePrims } from '/utils/mazes/algorithms.js'

const maze = new Maze(10, 10, truePrims)
maze.distances = maze.first_cell.distances.path_to(maze.last_cell)
const { tilemap } = maze

const enemyClasses = [GermanFlameThrowerAI, GermanMachineGunnerAI, GermanMachineGunnerAI, GermanMachineGunnerAI, SSSoldierAI, SSSoldierAI, SSSoldierAI, NaziOfficerAI]

hemLight({ intensity: .75 })
setBackground(0x070b34)

const cellSize = 10
const coords = getEmptyCoords(tilemap, cellSize)

scene.add(createGround({ file: 'terrain/ground.jpg' }))
const walls = meshFromTilemap({ tilemap, cellSize, texture: 'terrain/concrete.jpg' })

const show = new Snow()
scene.add(show.mesh)

const solids = [walls]

/* ACTORS */

const player = new FPSPlayer({ camera, coords, pointerLockId: 'instructions' })
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
  show.update({ delta, pos: player.position })
  tank.update(delta)
}()
