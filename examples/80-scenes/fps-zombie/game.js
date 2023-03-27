import { scene, renderer, camera, clock, setBackground } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { sample } from '/utils/helpers.js'
import { hemLight, lightningStrike } from '/utils/light.js'
import { Rain } from '/utils/classes/Particles.js'
import { PartisanPlayer, PartisanFPSPlayer } from '/utils/actors/ww2/Partisan.js'

import { GhostAI } from '/utils/actors/horror/Ghost.js'
import { GothGirlAI } from '/utils/actors/horror/GothGirl.js'
import { ZombieBarefootAI } from '/utils/actors/horror/ZombieBarefoot.js'
import { ZombieCopAI } from '/utils/actors/horror/ZombieCop.js'
import { ZombieDoctorCrawlAI } from '/utils/actors/horror/ZombieDoctorCrawl.js'
import { ZombieDoctorAI } from '/utils/actors/horror/ZombieDoctor.js'
import { ZombieGuardAI } from '/utils/actors/horror/ZombieGuard.js'

import Maze from '/utils/mazes/Maze.js'
import { truePrims } from '/utils/mazes/algorithms.js'

setBackground(0x070b34)
const light = hemLight({ intensity: .75 })

scene.add(createGround({ file: 'terrain/ground.jpg' }))

const rain = new Rain()
scene.add(rain.mesh)

const maze = new Maze(4, 4, truePrims, 20)
const walls = maze.toTiledMesh({ texture: 'terrain/concrete.jpg' })
const coords = maze.getEmptyCoords(true)
maze.braid()
const solids = [walls]

/* ACTORS */

const enemyClasses = [GhostAI, GothGirlAI, ZombieBarefootAI, ZombieCopAI, ZombieDoctorCrawlAI, ZombieDoctorAI, ZombieGuardAI]

const player = new PartisanFPSPlayer({ camera })
// player.cameraFollow.distance = 1
player.putInMaze(maze)
scene.add(player.mesh)

const enemies = []
for (let i = 0; i < 20; i++) {
  const EnemyClass = sample(enemyClasses)
  const enemy = new EnemyClass({ coords, target: player.mesh })
  enemies.push(enemy)
  solids.push(enemy.mesh)
}

player.addSolids(solids)
enemies.forEach(enemy => enemy.addSolids(solids))

scene.add(...solids)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  player.update(delta)
  enemies.forEach(enemy => enemy.update(delta))
  rain.update({ delta, pos: player.position })

  if (Math.random() > .997) lightningStrike(light)

  renderer.render(scene, camera)
}()
