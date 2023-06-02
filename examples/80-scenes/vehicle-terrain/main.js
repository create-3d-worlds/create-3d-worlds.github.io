import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { getHeightData } from '/utils/terrain/heightmap.js'
import { createTerrain } from '/utils/physics/index.js'
import { createSphere, createTremplin } from '/utils/geometry.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import Vehicle from '/utils/physics/Vehicle.js'

scene.add(createSun({ planetColor: 0xB0E0E6 }))

const world = new PhysicsWorld()

const { data, width, depth } = await getHeightData('/assets/heightmaps/wiki.png', 5)
const terrain = await createTerrain({ data, width, depth, minHeight: -2, maxHeight: 16 })
world.add(terrain)

const tremplin = createTremplin({ color: 0xfffacd })
tremplin.position.set(-10, -4.5, 20)
world.add(tremplin, 0)

for (let i = 0; i < 3; i++) {
  const ball = createSphere({ color: 0xfffacd })
  ball.position.set(5 * Math.random(), 0, -20 * Math.random())
  world.add(ball, 1000)
}

/* VEHICLE */

const mesh = await loadModel({ file: 'vehicle/ready/humvee/hummer.obj', mtl: 'vehicle/ready/humvee/hummer.mtl' })
const wheelMesh = await loadModel({ file: 'vehicle/ready/humvee/hummerTire.obj', mtl: 'vehicle/ready/humvee/hummerTire.mtl' })

const wheelFront = { x: 1.15, y: .15, z: 1.55 }
const wheelBack = { x: 1.15, y: .15, z: -1.8 }
const tank = new Vehicle({ camera, physicsWorld: world.physicsWorld, mesh, wheelMesh, wheelFront, wheelBack })
scene.add(mesh, ...tank.wheelMeshes)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  tank.update(dt)
  world.update(dt)
  renderer.render(scene, camera)
}()
