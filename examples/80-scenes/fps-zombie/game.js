import { scene, renderer, camera, clock, setBackground } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { sample } from '/utils/helpers.js'
import { getEmptyCoords, meshFromTilemap } from '/utils/mazes.js'
import { smallMap } from '/utils/data/maps.js'
import { hemLight, lightningStrike } from '/utils/light.js'
import { Rain } from '/utils/classes/Particles.js'
import FPSPlayer from '/utils/player/FPSPlayer.js'

import { GhostAI } from '/utils/actors/horror/Ghost.js'
import { GothGirlAI } from '/utils/actors/horror/GothGirl.js'
import { ZombieBarefootAI } from '/utils/actors/horror/ZombieBarefoot.js'
import { ZombieCopAI } from '/utils/actors/horror/ZombieCop.js'
import { ZombieDoctorCrawlAI } from '/utils/actors/horror/ZombieDoctorCrawl.js'
import { ZombieDoctorAI } from '/utils/actors/horror/ZombieDoctor.js'
import { ZombieGuardAI } from '/utils/actors/horror/ZombieGuard.js'

const enemyClasses = [GhostAI, GothGirlAI, ZombieBarefootAI, ZombieCopAI, ZombieDoctorCrawlAI, ZombieDoctorAI, ZombieGuardAI]

setBackground(0x070b34)
const light = hemLight({ intensity: .75 })

const cellSize = 20

scene.add(createGround({ file: 'terrain/ground.jpg' }))
const walls = meshFromTilemap({ tilemap: smallMap, cellSize, texture: 'terrain/concrete.jpg' })
const coords = getEmptyCoords(smallMap, cellSize)

const rain = new Rain()
scene.add(rain.mesh)

const solids = [walls]

/* ACTORS */

const player = new FPSPlayer({ camera, coords })
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
