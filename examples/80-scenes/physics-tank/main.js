import * as THREE from 'three'
import { scene, camera, createToonRenderer, clock } from '/utils/scene.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import { createGround } from '/utils/ground.js'
import { createMoonSphere, createTremplin, createCrates, createCrate, createRustyBarrel, createMetalBarrel } from '/utils/geometry/index.js'
import { createSun } from '/utils/light.js'
import { sample } from '/utils/helpers.js'
import { createFirTree } from '/utils/geometry/trees.js'
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import { leaveTracks } from '/utils/physics/leaveTracks.js'

const { randFloat } = THREE.MathUtils

const renderer = await createToonRenderer()

let i = 0
let time = 0
let tank, gui

scene.add(createSun())

const world = new PhysicsWorld()

const ground = createGround({ color: 0x509f53 })
world.add(ground, 0)

/* OBJECTS */

const tremplin = createTremplin()
world.add(tremplin, 0)

const crates = createCrates({ z: 10 })
crates.forEach(mesh => world.add(mesh, 20))
const countableCrates = crates.filter(mesh => mesh.position.y > .5)

for (let i = 0; i < 20; i++) {
  const mesh = createFirTree()
  mesh.position.set(randFloat(10, 50), 0, randFloat(-50, 50))
  world.add(mesh, 0)
}

const createObject = [createCrate, createRustyBarrel, createMetalBarrel, createMoonSphere]
for (let i = 0; i < 30; i++) {
  const mesh = sample(createObject)({ translateHeight: false })
  mesh.position.set(randFloat(-10, -50), 0, randFloat(-30, 30))
  world.add(mesh, 10)
}

const createBuilding = [createRuin, createWarehouse, createWarehouse2, createWarRuin, createAirport]
for (let i = -1; i < 5; i++)
  for (let j = 0; j < 3; j++) {
    const warehouse = sample(createBuilding)()
    warehouse.position.set(-i * 30, 0, j * 30 + 60)
    world.add(warehouse, 0)
  }

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  if (!tank) return

  const dt = clock.getDelta()
  const newTime = Math.floor(time + dt)

  tank.update(dt)
  leaveTracks({ vehicle: tank, ground, scene })
  world.update(dt)

  if (Math.floor(time) != newTime)
    gui.addScore(0, newTime)

  if (i++ % 3 === 0)
    countableCrates.forEach(mesh => {
      if (mesh.position.y <= 0.5) {
        countableCrates.splice(countableCrates.findIndex(c => c === mesh), 1)
        gui.addScore(-1, newTime)
      }
    })

  if (countableCrates.length)
    time += dt
  else
    gui.renderText(`Bravo!<br>You demolished everything in ${newTime} seconds.`)
}()

/* LAZY LOAD */

const tankFile = await import('/utils/physics/Tank.js')
tank = new tankFile.default({ physicsWorld: world.physicsWorld, camera, pos: { x: 0, y: 0, z: -20 } })
scene.add(tank.mesh)

const GUI = await import('/utils/io/GUI.js')
gui = new GUI.default({ scoreTitle: 'Crates left', points: countableCrates.length, subtitle: 'Time', total: 0, useBlink: true, controls: { Space: 'break' } })
gui.showMessage('Demolish all crates')
