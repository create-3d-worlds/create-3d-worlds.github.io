import Physijs from '/libs/physi-ecma.js'
import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene } from '/utils/physics.js'
import { loadModel } from '/utils/loaders.js'

const bwf = 3.5  // bus wheel friction
const bwr = .1  // bus wheel restitution

function configureWheel(wheel, position, BusSide) {
  BusSide === 'port' ? wheel.rotation.x = Math.PI / 2 : wheel.rotation.x = -Math.PI / 2
  wheel.position.set(position.x, position.y, position.z)
  wheel.setDamping(0.5, 0.5)
  wheel.castShadow = true
  scene.add(wheel)
}

function configureWheelConstraints(constraint) {
  scene.addConstraint(constraint)
  constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 })
  constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 })
  return constraint
}

export async function createBus(color) {  // "green" or "red"
  const bus = {}
  bus.score = 0

  const pos = (color == 'green' ? { x: -40, y: 3, z: 0 } : { x: 40, y: 3, z: 0 })  // bus mesh position
  const busFrameGeometry = new THREE.BoxGeometry(33, 4, 5)
  const busFrameMesh = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const busFrameMaterial = Physijs.createMaterial(busFrameMesh, 0.1, 0.9)
  bus.mesh = new Physijs.BoxMesh(busFrameGeometry, busFrameMaterial, 2000) // mass
  bus.mesh.position.set(pos.x, pos.y, pos.z)
  bus.mesh.castShadow = true

  const { mesh: model } = await loadModel({ file: `bus/${color}.glb`, size: 11 })
  model.rotateY(-1.5708)
  model.translateY(3.6)
  bus.mesh.add(model)

  if (color === 'green') bus.mesh.rotation.y = Math.PI

  scene.add(bus.mesh)

  const wheelRadius = 2  // wheel front and back radius
  const wheelWidth = 1
  const segments = 50
  const wheelMaterials = []
  const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, segments)

  // wheel side & back material (color only, no image)
  const wheelColorBaseMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 })
  const wheelColorMaterial = Physijs.createMaterial(wheelColorBaseMaterial, bwf, bwr)
  wheelMaterials.push(wheelColorMaterial)  // (.materialindex = 0)

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('/assets/images/bus_wheel.png', texture => {
    const wheelImageMaterial = Physijs.createMaterial(
      new THREE.MeshBasicMaterial({ map: texture }), bwf, bwr
    )
    wheelMaterials.push(wheelImageMaterial)  // (.materialindex = 1)
  })

  // wheel creation & configuration as four physi.js objects
  bus.wheel_fl_mesh = new Physijs.CylinderMesh(wheelGeometry, wheelMaterials, 300)
  bus.wheel_fr_mesh = new Physijs.CylinderMesh(wheelGeometry, wheelMaterials, 300)
  bus.wheel_bl_mesh = new Physijs.CylinderMesh(wheelGeometry, wheelMaterials, 300)
  bus.wheel_br_mesh = new Physijs.CylinderMesh(wheelGeometry, wheelMaterials, 300)

  let frontX, backX
  if (color === 'red') {
    frontX = pos.x - 9.5
    backX = pos.x + 9.5
  } else {
    frontX = pos.x + 9.5
    backX = pos.x - 9.5
  }
  configureWheel(bus.wheel_fl_mesh, { x: frontX, y: 2, z: pos.z + 5 }, 'port')
  configureWheel(bus.wheel_fr_mesh, { x: frontX, y: 2, z: pos.z - 5 }, 'starboard')
  configureWheel(bus.wheel_bl_mesh, { x: backX, y: 2, z: pos.z + 5 }, 'port')
  configureWheel(bus.wheel_br_mesh, { x: backX, y: 2, z: pos.z - 5 }, 'starboard')

  const frontLeftWheel = new Physijs.DOFConstraint(bus.wheel_fl_mesh, bus.mesh, bus.wheel_fl_mesh.position)
  const frontRightWheel = new Physijs.DOFConstraint(bus.wheel_fr_mesh, bus.mesh, bus.wheel_fr_mesh.position)
  const backLeftWheel = new Physijs.DOFConstraint(bus.wheel_bl_mesh, bus.mesh, bus.wheel_bl_mesh.position)
  const backRightWheel = new Physijs.DOFConstraint(bus.wheel_br_mesh, bus.mesh, bus.wheel_br_mesh.position)

  bus.frontLeftWheel = configureWheelConstraints(frontLeftWheel)
  bus.frontRightWheel = configureWheelConstraints(frontRightWheel)
  bus.backLeftWheel = configureWheelConstraints(backLeftWheel)
  bus.backRightWheel = configureWheelConstraints(backRightWheel)

  return bus
}
