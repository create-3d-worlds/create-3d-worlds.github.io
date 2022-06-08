import * as THREE from '/node_modules/three127/build/three.module.js'

const rad = degrees => degrees * (Math.PI / 180)

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
  head.rotation.x = rad(-20)
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
  face.rotation.y = rad(45)
  head.add(face)

  const woolGeometry = new THREE.BoxGeometry(0.84, 0.46, 0.9)
  const wool = new THREE.Mesh(woolGeometry, woolMaterial)
  wool.position.set(0, 0.12, 0.07)
  wool.rotation.x = rad(20)
  head.add(wool)

  const rightEyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6)
  const rightEye = new THREE.Mesh(rightEyeGeometry, darkMaterial)
  rightEye.castShadow = true
  rightEye.receiveShadow = true
  rightEye.position.set(0.35, -0.48, 0.33)
  rightEye.rotation.set(rad(130.8), 0, rad(-45))
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
  rightEar.rotation.set(rad(20), 0, rad(50))
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
  frontRightLeg.rotation.x = rad(-12)
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