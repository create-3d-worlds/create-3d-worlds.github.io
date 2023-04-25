import * as THREE from 'three'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createBox, createSphere, createCrates } from '/utils/geometry.js'
import VehicleCamera from '/utils/classes/VehicleCamera.js'
import PhysicsWorld from '/utils/classes/PhysicsWorld.js'
import Vehicle from '/utils/classes/Vehicle.js'
import { createGround } from '/utils/ground.js'
import { leaveDecals } from '/utils/decals.js'

scene.add(createSun())

const chaseCamera = new VehicleCamera({ camera })
const world = new PhysicsWorld()

const ground = createGround()
world.add(ground, 0)

const tremplin = createBox({ width: 8, height: 4, depth: 15, color: 0xfffacd })
tremplin.rotateX(-Math.PI / 15)
tremplin.position.set(-10, -tremplin.geometry.parameters.height / 2 + 1.5, 20)
world.add(tremplin, 0)

const ball = createSphere({ color: 0x333333 })
ball.position.set(5, 10, -10)
world.add(ball, 30)
ball.userData.body.setFriction(.9)
ball.userData.body.setRestitution(.95)

createCrates({ z: -20 }).forEach(mesh => world.add(mesh, 10))

/* VEHICLE */

const chassisMesh = await loadModel({ file: 'vehicle/ready/lada/lada.obj', mtl: 'vehicle/ready/lada/lada.mtl' })
const wheelMesh = await loadModel({ file: 'vehicle/ready/lada/ladaTire.obj', mtl: 'vehicle/ready/lada/ladaTire.mtl' })

const wheelFront = { x: 1.15, y: .4, z: 1.55 }
const wheelBack = { x: 1.15, y: .4, z: -1.8 }
const quaternion = new THREE.Quaternion(0, 0, 0, 1).setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)

const tank = new Vehicle({ physicsWorld: world.physicsWorld, chassisMesh, wheelMesh, wheelFront, wheelBack, position: new THREE.Vector3(0, 5, 0), quaternion })

scene.add(chassisMesh, ...tank.wheelMeshes)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  tank.update()
  leaveDecals({ ground, scene, vehicle: tank.vehicle, body: tank.body, wheelMeshes: tank.wheelMeshes })
  chaseCamera.update(tank.chassisMesh)
  const dt = clock.getDelta()
  world.update(dt)
  renderer.render(scene, camera)
}()
