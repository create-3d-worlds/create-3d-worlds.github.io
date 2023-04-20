import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { getHeightData } from '/utils/terrain/heightmap.js'
import { createTerrain } from '/utils/physics.js'
import { createSphere, createBox } from '/utils/geometry.js'
import VehicleCamera from '/utils/classes/VehicleCamera.js'
import PhysicsWorld from '/utils/classes/PhysicsWorld.js'
import Vehicle from '/utils/classes/Vehicle.js'

scene.add(createSun({ planetColor: 0xB0E0E6 }))

const world = new PhysicsWorld()
const cameraFollow = new VehicleCamera({ camera })

const { data, width, depth } = await getHeightData('/assets/heightmaps/wiki.png', 3)
const terrain = await createTerrain({ data, width, depth })
world.add(terrain)

const tremplin = createBox({ width: 8, height: 4, depth: 15, color: 0xfffacd })
tremplin.rotateX(-Math.PI / 15)
tremplin.position.set(-10, -7.5, 20)
world.add(tremplin, 0)

for (let i = 0; i < 3; i++) {
  const ball = createSphere({ color: 0xfffacd })
  ball.position.set(5 * Math.random(), 0, -20 * Math.random())
  world.add(ball, 3000)
}

/* VEHICLE */

const chassisMesh = await loadModel({ file: 'vehicle/ready/humvee/hummer.obj', mtl: 'vehicle/ready/humvee/hummer.mtl' })
const wheelMesh = await loadModel({ file: 'vehicle/ready/humvee/hummerTire.obj', mtl: 'vehicle/ready/humvee/hummerTire.mtl' })

const wheelFront = { x: 1.15, y: .15, z: 1.55 }
const wheelBack = { x: 1.15, y: .15, z: -1.8 }
const tank = new Vehicle({ physicsWorld: world.physicsWorld, chassisMesh, wheelMesh, wheelFront, wheelBack })
scene.add(chassisMesh, ...tank.wheelMeshes)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  tank.update()
  cameraFollow.update(tank.chassisMesh)
  const dt = clock.getDelta()
  world.update(dt)
  renderer.render(scene, camera)
}()
