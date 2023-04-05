import { scene, renderer, camera, clock, setBackground } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { sample } from '/utils/helpers.js'
import { hemLight, lightningStrike } from '/utils/light.js'
import { Rain } from '/utils/classes/Particles.js'
import { PartisanAimFPSPlayer } from '/utils/actor/derived/ww2/PartisanAim.js'

import { GhostAI } from '/utils/actor/derived/horror/Ghost.js'
import { GothGirlAI } from '/utils/actor/derived/horror/GothGirl.js'
import { ZombieBarefootAI } from '/utils/actor/derived/horror/ZombieBarefoot.js'
import { ZombieCopAI } from '/utils/actor/derived/horror/ZombieCop.js'
// import { ZombieDoctorCrawlAI } from '/utils/actor/derived/horror/ZombieDoctorCrawl.js'
import { ZombieDoctorAI } from '/utils/actor/derived/horror/ZombieDoctor.js'
import { ZombieGuardAI } from '/utils/actor/derived/horror/ZombieGuard.js'

import Maze from '/utils/mazes/Maze.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'

setBackground(0x070b34)
const light = hemLight({ intensity: .75 })

scene.add(createGround({ file: 'terrain/ground.jpg' }))

const rain = new Rain()
scene.add(rain.mesh)

const maze = new Maze(5, 10, recursiveBacktracker, 5)
const walls = maze.toTiledMesh({ texture: 'walls/stonetiles.jpg', maxHeight: 6 })
const coords = maze.getEmptyCoords(true)
maze.braid()
const solids = [walls]

/* ACTORS */

const enemyClasses = [GhostAI, GothGirlAI, ZombieBarefootAI, ZombieCopAI, ZombieDoctorAI, ZombieGuardAI]

const player = new PartisanAimFPSPlayer({ camera })
player.putInMaze(maze)
scene.add(player.mesh)

const enemies = []
for (let i = 0; i < 10; i++) {
  const EnemyClass = sample(enemyClasses)
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh })
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
