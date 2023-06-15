import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createGround, createFloor } from '/utils/ground.js'
import { sample, getEmptyCoords } from '/utils/helpers.js'
import { hemLight } from '/utils/light.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'
import Score from '/utils/io/Score.js'
import { createAirport } from '/utils/city.js'

const towers = []
const aircraft = []
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

const score = new Score({ subtitle: 'Aircraft left', total: aircraft.length })

/* LOOP */

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  if (!document.pointerLockElement) return
  const delta = clock.getDelta()

  const killed = aircraft.filter(plane => plane.energy <= 0)
  score.render(killed.length, aircraft.length - killed.length)

  player.update(delta)
  towers.forEach(obj => obj.update(delta))
  enemies.forEach(obj => obj.update(delta))
  aircraft.forEach(obj => obj.update(delta))
})

/* SOLDIERS */

const soldiers = ['GermanMachineGunner', 'SSSoldier', 'NaziOfficer']

for (let i = 0; i < 10; i++) {
  const name = sample(soldiers)
  const obj = await import(`/utils/actor/derived/ww2/${name}.js`)
  const EnemyClass = obj[name + 'AI']
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh })
  scene.add(enemy.mesh)
  enemies.push(enemy)
}

/* AIRCRAFT */

const dornierFile = await import('/utils/objects/DornierBomber.js')
for (let i = 0; i < 8; i++) { // front
  const plane = new dornierFile.default()
  plane.position.set(-50 + i * 15, plane.position.y, -75)
  scene.add(plane.mesh)
  plane.name = 'enemy'
  aircraft.push(plane)
}

const stukaFile = await import('/utils/objects/JunkersStuka.js')
for (let i = 0; i < 8; i++) { // left
  const plane = new stukaFile.default()
  plane.position.set(-55, plane.position.y, -55 + i * 12)
  scene.add(plane.mesh)
  plane.name = 'enemy'
  aircraft.push(plane)
}

const heinkelFile = await import('/utils/objects/HeinkelBomber.js')
for (let i = 0; i < 7; i++) { // back
  const plane = new heinkelFile.default()
  plane.position.set(-50 + i * 18, plane.position.y, 50)
  scene.add(plane.mesh)
  plane.name = 'enemy'
  aircraft.push(plane)
}

/* OBJECTS */

const towerFile = await import('/utils/objects/Tower.js')

;[[-75, -75], [-75, 75], [75, -75], [75, 75]].forEach(async coord => {
  const tower = new towerFile.default({ range: 50, interval: 1500, damage: 10, damageDistance: 1 })
  tower.position.set(coord[0], tower.position.y, coord[1])
  tower.name = 'enemy'
  towers.push(tower)
  scene.add(tower.mesh)
})

const airport = createAirport()
airport.translateX(50)
airport.rotateY(Math.PI * .5)
scene.add(airport)

const airport2 = airport.clone()
airport2.translateX(25)
scene.add(airport2)
