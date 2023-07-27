import * as THREE from 'three'

import { keyboard } from '/utils/io/Keyboard.js'
import { getSize } from '/utils/helpers.js'
import { Ammo, createRigidBody, updateMeshTransform } from '/utils/physics/index.js'
import ChaseCamera from '/utils/actor/ChaseCamera.js'

const FRONT_LEFT = 0
const FRONT_RIGHT = 1
const BACK_LEFT = 2
const BACK_RIGHT = 3

const steeringIncrement = .04
const steeringClamp = .5

function createWheelMesh(radius, width) {
  const geometry = new THREE.CylinderGeometry(radius, radius, width, 24, 1)
  geometry.rotateZ(Math.PI / 2)
  const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x111111 }))
  return mesh
}

export default class Vehicle {
  constructor({
    physicsWorld,
    mesh,
    defaultRadius = .4,
    wheelMesh = createWheelMesh(defaultRadius, defaultRadius * .5),
    wheelFront = { x: 1.1, y: .4, z: 1.55 },
    wheelBack = { x: 1.1, y: .4, z: -1.8 },
    mass = 800,
    maxEngineForce = 2000,
    maxBreakingForce = maxEngineForce * .01,
    maxSpeed = 80,
    pos,
    quaternion,
    camera,
  }) {
    this.mesh = mesh
    this.wheelMesh = wheelMesh
    this.wheelFront = wheelFront
    this.wheelBack = wheelBack
    this.maxEngineForce = maxEngineForce
    this.maxBreakingForce = maxBreakingForce
    this.engineForce = 0
    this.breakingForce = 0
    this.maxSpeed = maxSpeed
    this.input = keyboard
    const { x, y, z } = getSize(mesh)
    this.width = x
    this.height = y
    this.depth = z

    if (pos) mesh.position.copy(pos)
    if (quaternion) mesh.quaternion.copy(quaternion)

    if (camera)
      this.chaseCamera = new ChaseCamera({ camera, mesh, offset: [0, this.height, -this.depth], lookAt: [0, this.height, this.depth], speed: 4 })

    // body
    const shape = new Ammo.btBoxShape(new Ammo.btVector3(this.width * .5, this.height * .25, this.depth * .5))
    this.body = createRigidBody({ mesh, mass, shape })
    physicsWorld.addRigidBody(this.body)

    // vehicle
    const tuning = new Ammo.btVehicleTuning()
    const rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld)
    this.vehicle = new Ammo.btRaycastVehicle(tuning, this.body, rayCaster)
    this.vehicle.setCoordinateSystem(0, 1, 2)
    physicsWorld.addAction(this.vehicle)

    this.createWheels(tuning)
    this.addWheelMeshes(wheelMesh)

    this.vehicleSteering = 0
  }

  get speed() {
    return this.vehicle.getCurrentSpeedKmHour()
  }

  addWheelMeshes(wheelMesh) {
    this.wheelMeshes = []
    for (let i = 0; i < 4; i++) {
      const mesh = wheelMesh.clone()
      if (i == 0 || i == 3) mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI)
      this.wheelMeshes.push(mesh)
    }
  }

  createWheel(isFront, position, radius, tuning) {
    const friction = 1000
    const suspensionStiffness = 20.0
    const suspensionDamping = 2.3
    const suspensionCompression = 4.4
    const suspensionRestLength = 0.6
    const rollInfluence = 0.2

    const wheelDirection = new Ammo.btVector3(0, -1, 0)
    const wheelAxle = new Ammo.btVector3(-1, 0, 0)

    const wheelInfo = this.vehicle.addWheel(
      position, wheelDirection, wheelAxle, suspensionRestLength,
      radius, tuning, isFront
    )

    wheelInfo.set_m_suspensionStiffness(suspensionStiffness)
    wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping)
    wheelInfo.set_m_wheelsDampingCompression(suspensionCompression)
    wheelInfo.set_m_frictionSlip(friction)
    wheelInfo.set_m_rollInfluence(rollInfluence)
  }

  createWheels(tuning) {
    const { y } = getSize(this.wheelMesh)
    const { wheelFront, wheelBack } = this
    const wheelRadiusFront = y * .5, wheelRadiusBack = y * .5

    this.createWheel(true, new Ammo.btVector3(wheelFront.x, wheelFront.y, wheelFront.z), wheelRadiusFront, tuning)
    this.createWheel(true, new Ammo.btVector3(-wheelFront.x, wheelFront.y, wheelFront.z), wheelRadiusFront, tuning)
    this.createWheel(false, new Ammo.btVector3(-wheelBack.x, wheelBack.y, wheelBack.z), wheelRadiusBack, tuning)
    this.createWheel(false, new Ammo.btVector3(wheelBack.x, wheelBack.y, wheelBack.z), wheelRadiusBack, tuning)
  }

  /* UPDATE */

  updateMeshes() {
    const { vehicle, wheelMeshes } = this
    const n = vehicle.getNumWheels()
    for (let i = 0; i < n; i++) {
      vehicle.updateWheelTransform(i, true)
      updateMeshTransform(wheelMeshes[i], vehicle.getWheelTransformWS(i))
    }
    updateMeshTransform(this.mesh, vehicle.getChassisWorldTransform())
  }

  forward() {
    if (this.speed > this.maxSpeed) return
    this.engineForce = this.breakingForce = 0

    if (this.speed < -1)
      this.breakingForce = this.maxBreakingForce
    else
      this.engineForce = this.maxEngineForce
  }

  backward(multiplier = .5) {
    this.engineForce = this.breakingForce = 0
    if (this.speed > 1)
      this.breakingForce = this.maxBreakingForce
    else this.engineForce = -this.maxEngineForce * multiplier
  }

  break(multiplier = 1.5) {
    this.breakingForce = this.maxBreakingForce * multiplier
    this.engineForce = 0.0
  }

  handleInput() {
    const { input } = this
    if (input.up) this.forward()
    if (input.down) this.backward()

    if (input.left) {
      if (this.vehicleSteering < steeringClamp)
        this.vehicleSteering += steeringIncrement
    } else if (input.right) {
      if (this.vehicleSteering > -steeringClamp)
        this.vehicleSteering -= steeringIncrement
    } else if (this.vehicleSteering < -steeringIncrement)
      this.vehicleSteering += steeringIncrement
    else if (this.vehicleSteering > steeringIncrement)
      this.vehicleSteering -= steeringIncrement
    else
      this.vehicleSteering = 0

    if (input.jump) this.break()
  }

  updatePhysics() {
    const { vehicle } = this
    vehicle.applyEngineForce(this.engineForce, BACK_LEFT)
    vehicle.applyEngineForce(this.engineForce, BACK_RIGHT)

    vehicle.setBrake(this.breakingForce / 2, FRONT_LEFT)
    vehicle.setBrake(this.breakingForce / 2, FRONT_RIGHT)
    vehicle.setBrake(this.breakingForce, BACK_LEFT)
    vehicle.setBrake(this.breakingForce, BACK_RIGHT)

    vehicle.setSteeringValue(this.vehicleSteering, FRONT_LEFT)
    vehicle.setSteeringValue(this.vehicleSteering, FRONT_RIGHT)
  }

  update(dt) {
    this.break(.5)
    this.handleInput()
    this.updatePhysics()
    this.updateMeshes()
    this.chaseCamera?.update(dt)
  }
}