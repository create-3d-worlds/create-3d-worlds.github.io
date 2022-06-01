import Physijs from '/libs/physi-ecma.js'
import * as THREE from '/node_modules/three119/build/three.module.js'
import { GLTFLoader } from '/node_modules/three119/examples/jsm/loaders/GLTFLoader.js'
import { scene } from '/utils/physics.js'

const bwf = 3.5  // bus wheel friction
const bwr = 0  // bus wheel restitution

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

export function createBus(color) {  // "green" or "red"
  const bus = {}
  bus.score = 0

  // /mesh
  const pos = (color == 'green' ? { x: -40, y: 3, z: 0 } : { x: 40, y: 3, z: 0 })  // bus mesh position
  const busFrameGeometry = new THREE.BoxGeometry(33, 4, 5)
  const busFrameMesh = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const busFrameMaterial = Physijs.createMaterial(busFrameMesh, 0.9, 0.9)
  bus.mesh = new Physijs.BoxMesh(busFrameGeometry, busFrameMaterial, 2000) // mass
  bus.mesh.position.set(pos.x, pos.y, pos.z)
  bus.mesh.castShadow = true

  const loader = new GLTFLoader()
  loader.load(`./models/bus_body_${color}.glb`,
    gltf => {
      const scale = 5.6
      const model = gltf.scene.children[0]
      model.rotation.set (0, -1.5708, 0)
      model.scale.set (scale, scale, scale)
      model.position.set (0, 3.6, 0)
      model.castShadow = true
      bus.mesh.add(model)
    },
  )

  if (color === 'green') bus.mesh.rotation.y = Math.PI

  scene.add(bus.mesh)

  const wheelRadius = 2  // wheel front and back radius
  const wheelWidth = 1
  const segments = 50
  const wheelMaterials = []
  const wheelImage = './textures/bus_wheel_front_uv_fill.png'
  const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, segments)

  // wheel side & back material (color only, no image)
  const wheelColorBaseMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 })
  const wheelColorMaterial = Physijs.createMaterial(wheelColorBaseMaterial, bwf, bwr)
  wheelMaterials.push(wheelColorMaterial)  // (.materialindex = 0)

  // wheel front material (wheel image)
  const wheelImageLoader = new THREE.TextureLoader()
  wheelImageLoader.load(wheelImage, texture => {
    const wheelImageMaterial = Physijs.createMaterial(
      new THREE.MeshBasicMaterial({ map: texture }), bwf, bwr
    )
    wheelMaterials.push(wheelImageMaterial)  // (.materialindex = 1)
  })

  // assigns each of the wheel's faces to a .materialindex
  const wheelFaceCount = wheelGeometry.faces.length
  for (let i = 0; i < wheelFaceCount; i++)
    // first set of faces makes up the wheel's tread
    if (i < segments * 2)
      wheelGeometry.faces[i].materialIndex = 0 // assigns color material index
    // second set of faces makes up the wheel's outside
    else if (i < segments * 3)
      wheelGeometry.faces[i].materialIndex = 1 // assigns image material index
    // third set of faces makes up the wheel's inside
    else
      wheelGeometry.faces[i].materialIndex = 0 // assigns color material index

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

  // wheel constraints
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
