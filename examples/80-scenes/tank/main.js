import * as THREE from 'three'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import Tank from '/utils/physics/Tank.js'
import { createGround } from '/utils/ground.js'
import { createMoonSphere, createTremplin, createCrates, createCrate, createRustyBarrel, createMetalBarrel } from '/utils/geometry.js'
import { createSun } from '/utils/light.js'
import { sample } from '/utils/helpers.js'
import { createFirTree } from '/utils/geometry/trees.js'
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import Score from '/utils/io/Score.js'
import { leaveTracks } from '/utils/decals.js'

const { randFloat } = THREE.MathUtils

let i = 0
let time = 0

const world = new PhysicsWorld()

scene.add(createSun())

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
  world.add(mesh)
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
    world.add(warehouse)
  }

/* VEHICLE */

const tank = new Tank({ physicsWorld: world.physicsWorld, camera, pos: { x: 0, y: 0, z: -20 } })

scene.add(tank.mesh)

const score = new Score({ title: 'Crates left', points: countableCrates.length, subtitle: 'Seconds', total: time, showMessages: false })

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  const newTime = Math.floor(time + dt)

  tank.update(dt)
  leaveTracks({ vehicle: tank, ground, scene })
  world.update(dt)

  if (Math.floor(time) != newTime)
    score.update(0, newTime)

  if (i++ % 3 === 0)
    countableCrates.forEach(mesh => {
      if (mesh.position.y <= 0.5) {
        countableCrates.splice(countableCrates.findIndex(c => c === mesh), 1)
        score.update(-1, newTime)
      }
    })

  if (countableCrates.length)
    time += dt
  else
    score.renderText(`Bravo!<br>You demolished everything in ${newTime} seconds.`)

  renderer.render(scene, camera)
}()
