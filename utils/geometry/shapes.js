import * as THREE from 'three'
import { RIGHT_ANGLE } from '/utils/constants.js'
import { centerMesh, adjustHeight, randomGray } from '/utils/helpers.js'

/*  LOCOMOTIVE */

export function createLocomotive() {
  const group = new THREE.Group()

  const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff1111 })
  const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })

  const noseGeo = new THREE.CylinderGeometry(0.75, 0.75, 3, 12)
  const cabinGeo = new THREE.BoxGeometry(2, 2.25, 1.5)
  const chimneyGeo = new THREE.CylinderGeometry(0.3, 0.1, 0.5)
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.75, 16)
  wheelGeo.rotateX(RIGHT_ANGLE)

  const nose = new THREE.Mesh(noseGeo, redMaterial)
  nose.rotation.z = RIGHT_ANGLE
  nose.position.x = -1
  const cabin = new THREE.Mesh(cabinGeo, redMaterial)
  cabin.position.set(1.5, 0.4, 0)
  const chimney = new THREE.Mesh(chimneyGeo, blackMaterial)
  chimney.position.set(-2, 0.9, 0)
  const smallWheelRear = new THREE.Mesh(wheelGeo, blackMaterial)
  smallWheelRear.position.set(0, -0.5, 0)
  const smallWheelCenter = smallWheelRear.clone()
  smallWheelCenter.position.x = -1
  const smallWheelFront = smallWheelRear.clone()
  smallWheelFront.position.x = -2
  const bigWheel = smallWheelRear.clone()
  bigWheel.scale.set(2, 2, 1.25)
  bigWheel.position.set(1.5, -0.1, 0)

  group.add(nose, cabin, chimney, smallWheelRear, smallWheelCenter, smallWheelFront, bigWheel)
  group.rotation.y = Math.PI * .5
  group.position.y = .85

  centerMesh(group)
  adjustHeight(group)
  const wrapper = new THREE.Group()
  wrapper.add(group)
  return wrapper
}

/*  CLOUD */

export function createCloud() {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({
    color: 0xacb3fb,
    roughness: 1,
    flatShading: true
  })

  const partGeometry = new THREE.IcosahedronGeometry(1, 0)
  const upperPart = new THREE.Mesh(partGeometry, material)
  upperPart.name = 'upperPart'
  group.add(upperPart)

  const leftPart = upperPart.clone()
  leftPart.position.set(-1.2, -0.3, 0)
  leftPart.scale.set(0.8, 0.8, 0.8)
  leftPart.name = 'leftPart'
  group.add(leftPart)

  const rightPart = leftPart.clone()
  rightPart.position.x = -leftPart.position.x
  rightPart.name = 'rightPart'
  group.add(rightPart)

  const frontPart = leftPart.clone()
  frontPart.position.set(0, -0.4, 0.9)
  frontPart.scale.set(0.7, 0.7, 0.7)
  frontPart.name = 'frontPart'
  group.add(frontPart)

  const backPart = frontPart.clone()
  backPart.position.z = -frontPart.position.z
  backPart.name = 'backPart'
  group.add(backPart)

  group.traverse(part => {
    part.castShadow = true
    part.receiveShadow = false
  })
  group.scale.set(1.5, 1.5, 1.5)
  return group
}

export function updateCloud(group, elapsedTime) {
  const time = elapsedTime * 2
  group.getObjectByName('upperPart').position.y = -Math.cos(time) * 0.12
  group.getObjectByName('leftPart').position.y = -Math.cos(time) * 0.1 - 0.3
  group.getObjectByName('rightPart').position.y = -Math.cos(time) * 0.1 - 0.3
  group.getObjectByName('frontPart').position.y = -Math.cos(time) * 0.08 - 0.3
  group.getObjectByName('backPart').position.y = -Math.cos(time) * 0.08 - 0.3
}

/* TANK */

export function createTank({ tankWidth = 4, tankHeight = 1.2, tankLength = 8 } = {}) {
  const tank = new THREE.Object3D()

  const bodyGeometry = new THREE.BoxGeometry(
    tankWidth, tankHeight, tankLength
  )

  const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x615E3E })
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
  bodyMesh.position.y = 1.4
  bodyMesh.castShadow = true
  tank.add(bodyMesh)

  const wheelRadius = 1
  const wheelThickness = 0.5
  const wheelSegments = 8
  const wheelGeometry = new THREE.CylinderGeometry(
    wheelRadius, wheelRadius, wheelThickness, wheelSegments
  )
  const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 })
  const wheelPositions = [
    [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, tankLength / 3],
    [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, tankLength / 3],
    [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, 0],
    [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, 0],
    [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, -tankLength / 3],
    [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, -tankLength / 3]
  ]

  const wheels = wheelPositions.map(position => {
    const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial)
    mesh.position.set(...position)
    mesh.rotation.z = Math.PI * 0.5
    mesh.castShadow = true

    bodyMesh.add(mesh)
    return mesh
  })

  const domeRadius = 1.75
  const domeWidthSubdivisions = 12
  const domeHeightSubdivisions = 12
  const domePhiStart = 0
  const domePhiEnd = Math.PI * 2
  const domeThetaStart = 0
  const domeThetaEnd = Math.PI * 0.5
  const domeGeometry = new THREE.SphereGeometry(
    domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
    domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd
  )
  const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial)
  domeMesh.castShadow = true
  domeMesh.position.set(0, 0.5, -0.75)
  bodyMesh.add(domeMesh)

  const turretWidth = 0.06
  const turretHeight = 0.06
  const turretLength = tankLength * 0.16
  const turretGeometry = new THREE.CylinderGeometry(turretWidth, turretHeight, turretLength, 12)
  turretGeometry.rotateX(Math.PI / 2)
  const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial)
  turretMesh.castShadow = true
  turretMesh.position.z = turretLength * .5

  const tankGun = new THREE.Object3D()
  tankGun.scale.set(5, 5, 5)
  tankGun.position.y = .5
  tankGun.add(turretMesh)
  domeMesh.add(tankGun)

  return { tank, wheels, tankGun }
}

/* TOMB */

function createExtruded({ shape, x, y, z, color = randomGray(), scale = Math.random() * .01 + .02 }) {
  const params = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 }
  const geometry = new THREE.ExtrudeGeometry(shape, params)
  const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color }))
  mesh.position.set(x, y, z)
  mesh.scale.set(scale, scale, scale)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

const createTombShape = () => new THREE.Shape()
  .moveTo(40, 40)
  .lineTo(40, 100)
  .absarc(60, 100, 20, Math.PI, 0, true)
  .lineTo(80, 40)
  .absarc(60, 40, 20, 2 * Math.PI, Math.PI, true)

export const createTombstone = ({
  shape = createTombShape(), x = 0, y = -1, z = 0, scale = Math.random() * .01 + .02
} = {}) => createExtruded({ shape, x, y, z, scale })