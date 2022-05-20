import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { createParticles } from '/utils/particles.js'
import { randomInRange } from '/utils/helpers.js'

createOrbitControls()
hemLight()

const stars = createParticles({ file: 'star.png', num: 10000, color: 0xdddddd, size: .5, unitAngle: .2 })
scene.add(stars)

moveParticles({ particles: stars, min: 100, max: 1000 })

/* FUNCTIONS */

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
