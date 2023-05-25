import * as THREE from 'three'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import Vehicle from '/utils/physics/Vehicle.js'
import { loadModel } from '/utils/loaders.js'
import { createGround } from '/utils/ground.js'
import { createSphere, createTremplin, createCrates, createSimpleCastle, createCrate, createRustyBarrel, createMetalBarrel } from '/utils/geometry.js'
import { createSun } from '/utils/light.js'
import { addTexture, sample } from '/utils/helpers.js'
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

const wheelFront = { x: .75, y: .1, z: 1.25 }
const wheelBack = { x: .75, y: .1, z: -1.25 }
const chassisMesh = await loadModel({ file: 'tank/t-50/model.fbx' })
addTexture(chassisMesh, 'metal/metal01.jpg')

chassisMesh.position.set(tankX, 2, -20)
const tank = new Vehicle({ physicsWorld: world.physicsWorld, chassisMesh, wheelFront, wheelBack, maxEngineForce: 1000, camera })

scene.add(chassisMesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  tank.update(dt)
  world.update(dt)
  renderer.render(scene, camera)
}()
