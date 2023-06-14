import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createGround, createFloor } from '/utils/ground.js'
import { sample, getEmptyCoords } from '/utils/helpers.js'
import { hemLight } from '/utils/light.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'
import Score from '/utils/io/Score.js'
import { loadModel } from '/utils/loaders.js'

const enemies = []
const coords = getEmptyCoords()

hemLight({ intensity: .75 })
const ground = createGround({ file: 'terrain/ground.jpg' })
ground.position.y -= .1
scene.add(ground)
scene.add(createFloor({ size: 200 }))

/* ACTORS */

const player = new FPSPlayer({ camera, goal: 'Destroy all aircraft.' })
scene.add(player.mesh)

const score = new Score({ subtitle: 'Enemy left', total: enemies.length })

/* LOOP */

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  if (!document.pointerLockElement) return
  const delta = clock.getDelta()

  const killed = enemies.filter(enemy => enemy.energy <= 0)
  score.render(killed.length, enemies.length - killed.length)

  player.update(delta)
  enemies.forEach(enemy => enemy.update(delta))
})

/* LAZY LOAD */

const soldiers = ['GermanMachineGunner', 'SSSoldier', 'NaziOfficer']

for (let i = 0; i < 10; i++) {
  const name = sample(soldiers)
  const obj = await import(`/utils/actor/derived/ww2/${name}.js`)
  const EnemyClass = obj[name + 'AI']
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh })
  enemies.push(enemy)
  scene.add(enemy.mesh)
}

for (let i = 0; i < 10; i++) {
  const obj = await import('/utils/objects/HeinkelBomber.js')
  const aircraft = new obj.default()
  aircraft.position.set(-50 + i * 15, aircraft.position.y, -20)
  scene.add(aircraft.mesh)
}