import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createParticles } from '/utils/particles.js'
import { randomInRange, mouseToWorld } from '/utils/helpers.js'

let explosionPower

camera.position.set(5, 5, 3)
createOrbitControls()

const explosion = createParticles({ num: 30 })
scene.add(explosion)

function updateExplosion() {
  if (!explosion.visible) return
  explosion.geometry.vertices.forEach(vertex => {
    vertex.multiplyScalar(explosionPower)
  })
  if (explosionPower > 1.005) explosionPower -= 0.001
  else explosion.visible = false
  explosion.geometry.verticesNeedUpdate = true
}

function explode({ x = 0, y = 0, z = 0 } = {}) {
  explosion.position.set(x, y, z)
  explosion.geometry.vertices.forEach(vertex => {
    vertex.x = randomInRange(-0.2, 0.2)
    vertex.y = randomInRange(-0.2, 0.2)
    vertex.z = randomInRange(-0.2, 0.2)
  })
  explosionPower = 1.07
  explosion.visible = true
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  updateExplosion()
  requestAnimationFrame(render)
}()

/* EVENTS */

document.addEventListener('click', e => {
  const pos = mouseToWorld(e, camera)
  explode(pos)
})