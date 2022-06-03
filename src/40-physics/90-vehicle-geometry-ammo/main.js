/* global Ammo */
/* eslint-disable new-cap */
import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

const AMMO = await Ammo()

const DISABLE_DEACTIVATION = 4
const TRANSFORM_AUX = new AMMO.btTransform()
const ZERO_QUATERNION = new THREE.Quaternion(0, 0, 0, 1)

const clock = new THREE.Clock()

const syncList = []

// Keybord actions
const actions = {}
const keysActions = {
  'KeyW': 'acceleration',
  'KeyS': 'braking',
  'KeyA': 'left',
  'KeyD': 'right'
}

camera.position.x = -4.84
camera.position.z = -35.11
const controls = createOrbitControls()

const ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(10, 10, 5)
scene.add(dirLight)

const materialDynamic = new THREE.MeshPhongMaterial({ color: 0xfca400 })
const materialStatic = new THREE.MeshPhongMaterial({ color: 0x999999 })
const materialInteractive = new THREE.MeshPhongMaterial({ color: 0x990000 })

window.addEventListener('keydown', keydown)
window.addEventListener('keyup', keyup)

// initPhysics
const collisionConfiguration = new AMMO.btDefaultCollisionConfiguration()
const dispatcher = new AMMO.btCollisionDispatcher(collisionConfiguration)
const broadphase = new AMMO.btDbvtBroadphase()
const solver = new AMMO.btSequentialImpulseConstraintSolver()
const physicsWorld = new AMMO.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration)
physicsWorld.setGravity(new AMMO.btVector3(0, -9.82, 0))

function keyup(e) {
  if (keysActions[e.code])
    actions[keysActions[e.code]] = false
}

function keydown(e) {
  if (keysActions[e.code])
    actions[keysActions[e.code]] = true
}

function createBox(pos, quat, w, l, h, mass, friction) {
  const material = mass > 0 ? materialDynamic : materialStatic
  const shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1)
  const geometry = new AMMO.btBoxShape(new AMMO.btVector3(w * 0.5, l * 0.5, h * 0.5))

  if (!mass) mass = 0
  if (!friction) friction = 1

  const mesh = new THREE.Mesh(shape, material)
  mesh.position.copy(pos)
  mesh.quaternion.copy(quat)
  scene.add(mesh)

  const transform = new AMMO.btTransform()
  transform.setIdentity()
  transform.setOrigin(new AMMO.btVector3(pos.x, pos.y, pos.z))
  transform.setRotation(new AMMO.btQuaternion(quat.x, quat.y, quat.z, quat.w))
  const motionState = new AMMO.btDefaultMotionState(transform)

  const localInertia = new AMMO.btVector3(0, 0, 0)
  geometry.calculateLocalInertia(mass, localInertia)

  const rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia)
  const body = new AMMO.btRigidBody(rbInfo)

  body.setFriction(friction)
  physicsWorld.addRigidBody(body)

  if (mass > 0) {
    body.setActivationState(DISABLE_DEACTIVATION)
    // Sync physics and graphics
    function sync(dt) {
      const ms = body.getMotionState()
      if (ms) {
        ms.getWorldTransform(TRANSFORM_AUX)
        const p = TRANSFORM_AUX.getOrigin()
        const q = TRANSFORM_AUX.getRotation()
        mesh.position.set(p.x(), p.y(), p.z())
        mesh.quaternion.set(q.x(), q.y(), q.z(), q.w())
      }
    }
    syncList.push(sync)
  }
}

function createWheelMesh(radius, width) {
  const t = new THREE.CylinderGeometry(radius, radius, width, 24, 1)
  t.rotateZ(Math.PI / 2)
  const mesh = new THREE.Mesh(t, materialInteractive)
  mesh.add(new THREE.Mesh(new THREE.BoxGeometry(width * 1.5, radius * 1.75, radius * .25, 1, 1, 1), materialInteractive))
  scene.add(mesh)
  return mesh
}

function createChassisMesh(w, l, h) {
  const shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1)
  const mesh = new THREE.Mesh(shape, materialInteractive)
  scene.add(mesh)
  return mesh
}

function createVehicle(pos, quat) {
  // Vehicle contants
  const chassisWidth = 1.8
  const chassisHeight = .6
  const chassisLength = 4
  const massVehicle = 800

  const wheelAxisPositionBack = -1
  const wheelRadiusBack = .4
  const wheelWidthBack = .3
  const wheelHalfTrackBack = 1
  const wheelAxisHeightBack = .3

  const wheelAxisFrontPosition = 1.7
  const wheelHalfTrackFront = 1
  const wheelAxisHeightFront = .3
  const wheelRadiusFront = .35
  const wheelWidthFront = .2

  const friction = 1000
  const suspensionStiffness = 20.0
  const suspensionDamping = 2.3
  const suspensionCompression = 4.4
  const suspensionRestLength = 0.6
  const rollInfluence = 0.2

  const steeringIncrement = .04
  const steeringClamp = .5
  const maxEngineForce = 2000
  const maxBreakingForce = 100

  // Chassis
  const geometry = new AMMO.btBoxShape(new AMMO.btVector3(chassisWidth * .5, chassisHeight * .5, chassisLength * .5))
  const transform = new AMMO.btTransform()
  transform.setIdentity()
  transform.setOrigin(new AMMO.btVector3(pos.x, pos.y, pos.z))
  transform.setRotation(new AMMO.btQuaternion(quat.x, quat.y, quat.z, quat.w))
  const motionState = new AMMO.btDefaultMotionState(transform)
  const localInertia = new AMMO.btVector3(0, 0, 0)
  geometry.calculateLocalInertia(massVehicle, localInertia)
  const body = new AMMO.btRigidBody(new AMMO.btRigidBodyConstructionInfo(massVehicle, motionState, geometry, localInertia))
  body.setActivationState(DISABLE_DEACTIVATION)
  physicsWorld.addRigidBody(body)
  const chassisMesh = createChassisMesh(chassisWidth, chassisHeight, chassisLength)

  // Raycast Vehicle
  let engineForce = 0
  let vehicleSteering = 0
  let breakingForce = 0
  const tuning = new AMMO.btVehicleTuning()
  const rayCaster = new AMMO.btDefaultVehicleRaycaster(physicsWorld)
  const vehicle = new AMMO.btRaycastVehicle(tuning, body, rayCaster)
  vehicle.setCoordinateSystem(0, 1, 2)
  physicsWorld.addAction(vehicle)

  // Wheels
  const FRONT_LEFT = 0
  const FRONT_RIGHT = 1
  const BACK_LEFT = 2
  const BACK_RIGHT = 3
  const wheelMeshes = []
  const wheelDirectionCS0 = new AMMO.btVector3(0, -1, 0)
  const wheelAxleCS = new AMMO.btVector3(-1, 0, 0)

  function addWheel(isFront, pos, radius, width, index) {
    const wheelInfo = vehicle.addWheel(
      pos,
      wheelDirectionCS0,
      wheelAxleCS,
      suspensionRestLength,
      radius,
      tuning,
      isFront)

    wheelInfo.set_m_suspensionStiffness(suspensionStiffness)
    wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping)
    wheelInfo.set_m_wheelsDampingCompression(suspensionCompression)
    wheelInfo.set_m_frictionSlip(friction)
    wheelInfo.set_m_rollInfluence(rollInfluence)
    wheelMeshes[index] = createWheelMesh(radius, width)
  }

  addWheel(true, new AMMO.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT)
  addWheel(true, new AMMO.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT)
  addWheel(false, new AMMO.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT)
  addWheel(false, new AMMO.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT)

  // Sync keybord actions and physics and graphics
  function sync(dt) {
    const speed = vehicle.getCurrentSpeedKmHour()
    breakingForce = 0
    engineForce = 0

    if (actions.acceleration)
      if (speed < -1)
        breakingForce = maxBreakingForce
      else engineForce = maxEngineForce

    if (actions.braking)
      if (speed > 1)
        breakingForce = maxBreakingForce
      else engineForce = -maxEngineForce / 2

    if (actions.left) {
      if (vehicleSteering < steeringClamp)
        vehicleSteering += steeringIncrement
    } else
    if (actions.right) {
      if (vehicleSteering > -steeringClamp)
        vehicleSteering -= steeringIncrement
    } else
    if (vehicleSteering < -steeringIncrement)
      vehicleSteering += steeringIncrement
    else
    if (vehicleSteering > steeringIncrement)
      vehicleSteering -= steeringIncrement
    else
      vehicleSteering = 0

    vehicle.applyEngineForce(engineForce, BACK_LEFT)
    vehicle.applyEngineForce(engineForce, BACK_RIGHT)

    vehicle.setBrake(breakingForce / 2, FRONT_LEFT)
    vehicle.setBrake(breakingForce / 2, FRONT_RIGHT)
    vehicle.setBrake(breakingForce, BACK_LEFT)
    vehicle.setBrake(breakingForce, BACK_RIGHT)

    vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT)
    vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT)

    let tm, p, q, i
    const n = vehicle.getNumWheels()
    for (i = 0; i < n; i++) {
      vehicle.updateWheelTransform(i, true)
      tm = vehicle.getWheelTransformWS(i)
      p = tm.getOrigin()
      q = tm.getRotation()
      wheelMeshes[i].position.set(p.x(), p.y(), p.z())
      wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w())
    }
    tm = vehicle.getChassisWorldTransform()
    p = tm.getOrigin()
    q = tm.getRotation()
    chassisMesh.position.set(p.x(), p.y(), p.z())
    chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w())
  }
  syncList.push(sync)
}

function createObjects() {
  createBox(new THREE.Vector3(0, -0.5, 0), ZERO_QUATERNION, 75, 1, 75, 0, 2)

  const quaternion = new THREE.Quaternion(0, 0, 0, 1)
  quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 18)
  createBox(new THREE.Vector3(0, -1.5, 0), quaternion, 8, 4, 10, 0)

  const size = .75
  const nw = 8
  const nh = 6
  for (let j = 0; j < nw; j++)
    for (let i = 0; i < nh; i++)
      createBox(new THREE.Vector3(size * j - (size * (nw - 1)) / 2, size * i, 10), ZERO_QUATERNION, size, size, size, 10)

  createVehicle(new THREE.Vector3(0, 4, -20), ZERO_QUATERNION)
}

createObjects()

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  for (let i = 0; i < syncList.length; i++)
    syncList[i](dt)
  physicsWorld.stepSimulation(dt, 10)
  controls.update(dt)
  renderer.render(scene, camera)
}()