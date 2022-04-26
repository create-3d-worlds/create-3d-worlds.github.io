import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'
import { Cloud } from './Cloud.js'

createOrbitControls()
renderer.setClearColor(0x7ec0ee)

const clouds = createClouds()
scene.add(clouds)

function createClouds() {
  const cloudCount = 200
  const group = new THREE.Group()
  const range = 50
  const angl = Math.PI / 2

  for (let i = 0; i < cloudCount; i++) {
    const cloud = new Cloud()
    cloud.position.set(randomInRange(-range, range), randomInRange(0, range), randomInRange(-range, range))
    cloud.rotation.set(randomInRange(-angl, angl), randomInRange(-angl, angl), randomInRange(-angl, angl))
    const scale = 2.0 + Math.random() * 6
    cloud.scale.set(scale, scale, scale)
    group.add(cloud)
  }
  return group
}

function updateClouds(clouds, t) {
  for (let i = 0, n = clouds.children.length; i < n; i++) {
    const cloud = clouds.children[i]
    cloud.update(t)
  }
}

void function loop() {
  requestAnimationFrame(loop)
  const t = clock.getElapsedTime() * 5
  updateClouds(clouds, t)
  renderer.render(scene, camera)
}()
