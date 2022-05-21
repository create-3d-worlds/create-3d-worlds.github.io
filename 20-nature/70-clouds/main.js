import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'
import { Cloud } from './Cloud.js'

const cloudCount = 200
const range = 100

renderer.setClearColor(0x7ec0ee)

createOrbitControls()
camera.position.set(0, 20, 75)

const clouds = createClouds()
scene.add(clouds)

/* FUNCTIONS */

function createClouds() {
  const group = new THREE.Group()
  const { PI } = Math
  for (let i = 0; i < cloudCount; i++) {
    const cloud = new Cloud()
    cloud.position.set(randomInRange(-range, range), randomInRange(0, range), randomInRange(-range, range))
    cloud.rotation.set(randomInRange(-PI, PI), randomInRange(-PI, PI), randomInRange(-PI, PI))
    const scale = randomInRange(4, 12)
    cloud.scale.set(scale, scale, scale)
    group.add(cloud)
  }
  return group
}

function updateClouds(clouds, t) {
  for (let i = 0, n = clouds.children.length; i < n; i++) {
    const cloud = clouds.children[i]
    cloud.update(t)
    cloud.position.z -= 0.1
  }
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const t = clock.getElapsedTime() * 5
  updateClouds(clouds, t)
  renderer.render(scene, camera)
}()
