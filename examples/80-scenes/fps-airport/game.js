import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createGround, createFloor } from '/utils/ground.js'
import { sample, getEmptyCoords } from '/utils/helpers.js'
import { hemLight } from '/utils/light.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'
import Score from '/utils/io/Score.js'
import { createAirport } from '/utils/city.js'

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

/* SOLDIERS */

const soldiers = ['GermanMachineGunner', 'SSSoldier', 'NaziOfficer']

for (let i = 0; i < 10; i++) {
  const name = sample(soldiers)
  const obj = await import(`/utils/actor/derived/ww2/${name}.js`)
  const EnemyClass = obj[name + 'AI']
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh })
  enemies.push(enemy)
  scene.add(enemy.mesh)
}

/* AIRCRAFT */

for (let i = 0; i < 8; i++) { // left
  const obj = await import('/utils/objects/JunkersStuka.js')
  const aircraft = new obj.default()
  aircraft.position.set(-55, aircraft.position.y, -55 + i * 12)
  scene.add(aircraft.mesh)
}

for (let i = 0; i < 8; i++) { // front
  const obj = await import('/utils/objects/DornierBomber.js')
  const aircraft = new obj.default()
  aircraft.position.set(-50 + i * 15, aircraft.position.y, -75)
  scene.add(aircraft.mesh)
}

for (let i = 0; i < 7; i++) { // back
  const obj = await import('/utils/objects/HeinkelBomber.js')
  const aircraft = new obj.default()
  aircraft.position.set(-50 + i * 18, aircraft.position.y, 50)
  scene.add(aircraft.mesh)
}

/* OBJECTS */

const airport = createAirport()
airport.translateX(50)
airport.rotateY(Math.PI * .5)
scene.add(airport)

const airport2 = airport.clone()
airport2.translateX(25)
scene.add(airport2)
