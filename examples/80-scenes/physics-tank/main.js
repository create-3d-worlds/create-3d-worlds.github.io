import * as THREE from 'three'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import Tank from '/utils/physics/Tank.js'
import { createGround } from '/utils/ground.js'
import { createSphere, createTremplin, createCrates, createSimpleCastle, createCrate, createRustyBarrel, createMetalBarrel } from '/utils/geometry.js'
import { createSun } from '/utils/light.js'
import { sample } from '/utils/helpers.js'
import { createFirTrees } from '/utils/geometry/trees.js'

const { randFloat } = THREE.MathUtils

const tankX = -20

const world = new PhysicsWorld()

scene.add(createSun())

const ground = createGround({ color: 0x509f53 })
world.add(ground, 0)

/* OBJECTS */

const tremplin = createTremplin()
tremplin.position.x = tankX
world.add(tremplin, 0)

createCrates({ x: tankX, z: 10 }).forEach(mesh => world.add(mesh))

createSimpleCastle({ rows: 6, brickInWall: 14 }).forEach(block => world.add(block, 5))

const createMoon = () => createSphere({ r: .5, file: 'planets/moon.jpg' })

const methods = [createMoon, createCrate, createRustyBarrel, createMetalBarrel]

for (let i = 0; i < 10; i++) {
  const mesh = sample(methods)({ translateHeight: false })
  mesh.position.set(randFloat(-10, -50), 0, randFloat(-20, 20))
  world.add(mesh, 10)
}

createFirTrees({ n: 20, mapSize: 200 }).children.forEach(tree => world.add(tree, 0))

/* VEHICLE */

const tank = new Tank({ physicsWorld: world.physicsWorld, camera, pos: { x: tankX, y: 2, z: -20 } })

scene.add(tank.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  tank.update(dt)
  world.update(dt)
  renderer.render(scene, camera)
}()
