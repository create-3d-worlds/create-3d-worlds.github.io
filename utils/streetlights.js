import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomInRange, randomInCircle, randomInSquare } from '/utils/helpers.js'

export function createLamppost({ x = 0, z = 0, height = 40 } = {}) {
  const group = new THREE.Group()

  const sphereGeometry = new THREE.SphereGeometry(2, 12, 16)
  const colors = [0xF5F5DC, 0xdceff5, 0xFFFF8F, 0xFFFDD0]
  const color = colors[Math.floor(Math.random() * colors.length)]
  const sphereMaterial = new THREE.MeshBasicMaterial({ color })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(x, height, z)
  group.add(sphere)

  const cylinderGeometry = new THREE.CylinderGeometry(.5, .5, height, 6)
  const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x242731 })
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
  cylinder.position.set(x, height * .5, z)
  cylinder.receiveShadow = true
  group.add(cylinder)

  const lamppost = new THREE.SpotLight(color)
  lamppost.position.set(x, height, z)
  lamppost.target.position.set(x, 0, z)
  lamppost.target.updateMatrixWorld()

  lamppost.angle = randomInRange(Math.PI / 6, Math.PI / 3)
  lamppost.intensity = randomInRange(.5, 2) // 1.8 // 0-2
  lamppost.penumbra = 0.5
  lamppost.distance = height * 2

  lamppost.castShadow = true
  group.add(lamppost)

  return group
}

export function createLampposts({ size = 200, numLampposts = 10, height = 40, circle = true } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < numLampposts; i++) {
    const { x, z } = circle ? randomInCircle(size) : randomInSquare(size)
    const lamppost = createLamppost({ x, z, height })
    group.add(lamppost)
  }
  return group
}

export function createCityLights({ size, numLights = 10, height = 10, circle = true } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < numLights; i++) {
    const spotLight = new THREE.SpotLight(0xF5F5DC)
    const { x, z } = circle ? randomInCircle(size) : randomInSquare(size)
    spotLight.position.set(x, height, z)
    spotLight.castShadow = true
    group.add(spotLight)
  }
  return group
}