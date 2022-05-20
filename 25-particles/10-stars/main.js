import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

createOrbitControls()
hemLight()

const stars = createParticles({ file: 'star.png', num: 10000, unitAngle: .2 })
scene.add(stars)

moveParticles({ particles: stars, min: 100, max: 1000 })

/* FUNCTIONS */

function createParticles({ num = 100, color = 0xdddddd, size = .5, unitAngle = 1, file } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
    geometry.vertices.push(vertex)
  }
  const material = new THREE.PointsMaterial({
    size,
    color,
    transparent: true,
    map: file ? new THREE.TextureLoader().load(`/assets/textures/${file}`) : null,
  })
  return new THREE.Points(geometry, material)
}

function moveParticles({ particles, distance, min = 0, max = 1000 } = {}) {
  distance = distance ? distance : randomInRange(min, max) // eslint-disable-line no-param-reassign
  particles.geometry.vertices.forEach(vertex => {
    vertex.multiplyScalar(distance)
  })
  // particles.geometry.verticesNeedUpdate = true
}

/* LOOP */

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
