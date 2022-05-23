import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

function createParticles({ num = 10000, color, size = .5, opacity = 1, unitAngle = 1, minRange = 100, maxRange = 1000, depthTest = true } = {}) {

  const geometry = new THREE.BufferGeometry()
  const positions = []

  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
    const scalar = randomInRange(minRange, maxRange)
    vertex.multiplyScalar(scalar)
    positions.push(vertex.x)
    positions.push(vertex.y)
    positions.push(vertex.z)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    size,
    transparent: true,
    opacity,
    depthTest,
  })
  if (color)
    material.color = new THREE.Color(color)

  return new THREE.Points(geometry, material)
}

createOrbitControls()

const stars = createParticles()
scene.add(stars)

/* LOOP */

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
