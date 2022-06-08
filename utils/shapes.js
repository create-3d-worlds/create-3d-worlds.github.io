import * as THREE from '/node_modules/three127/build/three.module.js'
import { DEGREE } from '/utils/constants.js'
import { degToRad } from '/utils/helpers.js'

export function createSheep() {
  const group = new THREE.Group()
  group.position.y = 0.4

  const woolMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    flatShading: true
  })
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaf8b,
    roughness: 1,
    flatShading: true
  })
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x4b4553,
    roughness: 1,
    flatShading: true
  })

  const bodyGeometry = new THREE.IcosahedronGeometry(1.7, 0)
  const body = new THREE.Mesh(bodyGeometry, woolMaterial)
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  const head = new THREE.Group()
  head.position.set(0, 0.65, 1.6)
  head.rotation.x = degToRad(-20)
  group.add(head)

  const foreheadGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.7)
  const forehead = new THREE.Mesh(foreheadGeometry, skinMaterial)
  forehead.castShadow = true
  forehead.receiveShadow = true
  forehead.position.y = -0.15
  head.add(forehead)

  const faceGeometry = new THREE.CylinderGeometry(0.5, 0.15, 0.4, 4, 1)
  const face = new THREE.Mesh(faceGeometry, skinMaterial)
  face.castShadow = true
  face.receiveShadow = true
  face.position.y = -0.65
  face.rotation.y = degToRad(45)
  head.add(face)

  const woolGeometry = new THREE.BoxGeometry(0.84, 0.46, 0.9)
  const wool = new THREE.Mesh(woolGeometry, woolMaterial)
  wool.position.set(0, 0.12, 0.07)
  wool.rotation.x = degToRad(20)
  head.add(wool)

  const rightEyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6)
  const rightEye = new THREE.Mesh(rightEyeGeometry, darkMaterial)
  rightEye.castShadow = true
  rightEye.receiveShadow = true
  rightEye.position.set(0.35, -0.48, 0.33)
  rightEye.rotation.set(degToRad(130.8), 0, degToRad(-45))
  head.add(rightEye)

  const leftEye = rightEye.clone()
  leftEye.position.x = -rightEye.position.x
  leftEye.rotation.z = -rightEye.rotation.z
  head.add(leftEye)

  const rightEarGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.3)
  rightEarGeometry.translate(0, -0.25, 0)
  const rightEar = new THREE.Mesh(rightEarGeometry, skinMaterial)
  rightEar.castShadow = true
  rightEar.receiveShadow = true
  rightEar.position.set(0.35, -0.12, -0.07)
  rightEar.rotation.set(degToRad(20), 0, degToRad(50))
  rightEar.name = 'rightEar'
  head.add(rightEar)

  const leftEar = rightEar.clone()
  leftEar.position.x = -rightEar.position.x
  leftEar.rotation.z = -rightEar.rotation.z
  leftEar.name = 'leftEar'
  head.add(leftEar)

  const legGeometry = new THREE.CylinderGeometry(0.3, 0.15, 1, 4)
  legGeometry.translate(0, -0.5, 0)
  const frontRightLeg = new THREE.Mesh(legGeometry, darkMaterial)
  frontRightLeg.castShadow = true
  frontRightLeg.receiveShadow = true
  frontRightLeg.position.set(0.7, -0.8, 0.5)
  frontRightLeg.rotation.x = degToRad(-12)
  frontRightLeg.name = 'frontRightLeg'
  group.add(frontRightLeg)

  const frontLeftLeg = frontRightLeg.clone()
  frontLeftLeg.position.x = -frontRightLeg.position.x
  frontLeftLeg.rotation.z = -frontRightLeg.rotation.z
  frontLeftLeg.name = 'frontLeftLeg'
  group.add(frontLeftLeg)

  const backRightLeg = frontRightLeg.clone()
  backRightLeg.position.z = -frontRightLeg.position.z
  backRightLeg.rotation.x = -frontRightLeg.rotation.x
  backRightLeg.name = 'backRightLeg'
  group.add(backRightLeg)

  const backLeftLeg = frontLeftLeg.clone()
  backLeftLeg.position.z = -frontLeftLeg.position.z
  backLeftLeg.rotation.x = -frontLeftLeg.rotation.x
  backLeftLeg.name = 'backLeftLeg'
  group.add(backLeftLeg)

  return group
}

export function createAirplane() {
  const airplane = new THREE.Object3D()
  const material = new THREE.MeshPhongMaterial({ shininess: 100 })

  const nose = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 16), material)
  nose.rotation.x = 90 * DEGREE
  nose.scale.y = 3
  nose.position.y = 0
  nose.position.z = 70
  airplane.add(nose)

  const body = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 180, 32), material)
  body.rotation.x = 90 * DEGREE
  body.position.y = 0
  body.position.z = -20
  airplane.add(body)

  const wing = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 250, 32), material)
  wing.scale.x = 0.2
  wing.rotation.z = 90 * DEGREE
  wing.position.y = 5
  airplane.add(wing)

  const tailWing = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 100, 32), material)
  tailWing.scale.x = 0.2
  tailWing.rotation.z = 90 * DEGREE
  tailWing.position.y = 5
  tailWing.position.z = -90
  airplane.add(tailWing)

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(10, 15, 40, 32), material)
  tail.scale.x = 0.15
  tail.rotation.x = -10 * DEGREE
  tail.position.y = 20
  tail.position.z = -96
  airplane.add(tail)
  return airplane
}