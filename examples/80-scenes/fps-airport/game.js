import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createGround, createFloor } from '/utils/ground.js'
import { sample, getEmptyCoords } from '/utils/helpers.js'
import { createSun } from '/utils/light.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'
import GUI from '/utils/io/GUI.js'
import { createAirport } from '/utils/city.js'
import { loadModel } from '/utils/loaders.js'
import Report from '/utils/io/Report.js'

const mapSize = 200
const aircraft = []
const enemies = []
const solids = []
const dornierNum = 8, stukaNum = 8, heinkelNum = 7

scene.add(createSun())

const ground = createGround({ file: 'terrain/ground.jpg' })
ground.position.y -= .1
scene.add(ground)
scene.add(createFloor({ size: mapSize, file: 'terrain/asphalt.jpg' }))

const coords = getEmptyCoords({ mapSize: mapSize * .5 })
const gui = new GUI({ subtitle: 'Aircraft left', total: dornierNum + stukaNum + heinkelNum, scoreClass: '' })

const player = new FPSPlayer({ camera, pos: [100, 0, 0] })
player.lookAt(scene.position)
scene.add(player.mesh)

new Report({ container: player.window, text: 'The German planes that sow death among our combatants are stationed at the Rajlovac Airport near Sarajevo.\n\nEnter the airport and destroy all enemy aircraft.' })

/* UTILS */

const addEnemy = (obj, arr) => {
  arr.push(obj)
  obj.name = 'enemy'
  scene.add(obj.mesh)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  if (!document.pointerLockElement) return
  const delta = clock.getDelta()

  const destroyed = aircraft.filter(plane => plane.energy <= 0)
  gui.renderScore(destroyed.length, aircraft.length - destroyed.length)

  if (destroyed.length == aircraft.length)
    gui.renderText('Congratulations!<br>All enemy planes were destroyed.')

  player.update(delta)
  enemies.forEach(obj => obj.update(delta))
  aircraft.forEach(obj => obj.update(delta))
}()

/* AIRCRAFT */

const dornierFile = await import('/utils/objects/DornierBomber.js')
for (let i = 0; i < dornierNum; i++) { // front
  const plane = new dornierFile.default({ pos: [-50 + i * 15, 0, -75] })
  addEnemy(plane, aircraft)
}

const stukaFile = await import('/utils/objects/JunkersStuka.js')
for (let i = 0; i < stukaNum; i++) { // left
  const plane = new stukaFile.default({ pos: [-55, 0, -55 + i * 12] })
  addEnemy(plane, aircraft)
}

const heinkelFile = await import('/utils/objects/HeinkelBomber.js')
for (let i = 0; i < heinkelNum; i++) { // back
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
airport.translateX(75)
airport.rotateY(Math.PI * .5)

const airport2 = airport.clone()
airport2.translateX(25)

const bunker = await loadModel({ file: 'building/bunker.fbx', size: 3, texture: 'terrain/concrete.jpg' })
bunker.position.set(75, 0, 25)

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
