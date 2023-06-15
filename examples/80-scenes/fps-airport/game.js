import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createGround, createFloor } from '/utils/ground.js'
import { sample, getEmptyCoords, addTexture } from '/utils/helpers.js'
import { hemLight } from '/utils/light.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'
import Score from '/utils/io/Score.js'
import { createAirport } from '/utils/city.js'
import { loadModel } from '/utils/loaders.js'

const mapSize = 200
const aircraft = []
const enemies = []
const solids = []

hemLight({ intensity: .75 })

const ground = createGround({ file: 'terrain/ground.jpg' })
ground.position.y -= .1
scene.add(ground)
scene.add(createFloor({ size: mapSize, file: 'terrain/asphalt.jpg' }))

const coords = getEmptyCoords({ mapSize })
const score = new Score({ subtitle: 'Aircraft left', total: aircraft.length })

const player = new FPSPlayer({ camera, goal: 'Destroy all enemy aircraft.', pos: [100, 0, 0] })
player.lookAt(scene.position)
scene.add(player.mesh)

/* UTILS */

const addEnemy = (obj, arr) => {
  arr.push(obj)
  obj.name = 'enemy'
  scene.add(obj.mesh)
}

/* LOOP */

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  if (!document.pointerLockElement) return
  const delta = clock.getDelta()

  const destroyed = aircraft.filter(plane => plane.energy <= 0)
  score.render(destroyed.length, aircraft.length - destroyed.length)

  player.update(delta)
  enemies.forEach(obj => obj.update(delta))
  aircraft.forEach(obj => obj.update(delta))
})

/* AIRCRAFT */

const dornierFile = await import('/utils/objects/DornierBomber.js')
for (let i = 0; i < 8; i++) { // front
  const plane = new dornierFile.default({ pos: [-50 + i * 15, 0, -75] })
  addEnemy(plane, aircraft)
}

const stukaFile = await import('/utils/objects/JunkersStuka.js')
for (let i = 0; i < 8; i++) { // left
  const plane = new stukaFile.default({ pos: [-55, 0, -55 + i * 12] })
  addEnemy(plane, aircraft)
}

const heinkelFile = await import('/utils/objects/HeinkelBomber.js')
for (let i = 0; i < 7; i++) { // back
  const plane = new heinkelFile.default({ pos: [-50 + i * 18, 0, 50] })
  addEnemy(plane, aircraft)
}

/* OBJECTS */

const towerFile = await import('/utils/objects/Tower.js')

;[[-75, -75], [-75, 75], [75, -75], [75, 75]].forEach(async([x, z]) => {
  const tower = new towerFile.default({ pos: [x, 0, z], range: 50, interval: 1500, damage: 10, damageDistance: 1 })
  addEnemy(tower, enemies)
})

const airport = createAirport()
airport.translateX(50)
airport.rotateY(Math.PI * .5)

const airport2 = airport.clone()
airport2.translateX(25)

const bunker = await loadModel({ file: 'building/bunker.fbx', size: 3 })
bunker.position.set(50, 0, 25)
addTexture(bunker, 'terrain/concrete.jpg')

scene.add(airport, airport2, bunker)
solids.push(airport, airport2, bunker)
player.addSolids(solids)

/* SOLDIERS */

const soldiers = ['GermanMachineGunner', 'SSSoldier', 'NaziOfficer']
for (let i = 0; i < 10; i++) {
  const name = sample(soldiers)
  const obj = await import(`/utils/actor/derived/ww2/${name}.js`)
  const EnemyClass = obj[name + 'AI']
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh, mapSize })
  addEnemy(enemy, enemies)
  enemy.addSolids(solids)
}

const obj = await import('/utils/actor/derived/Tank.js')
const tank = new obj.TankAI({ mapSize })
addEnemy(tank, enemies)
tank.addSolids(solids)
