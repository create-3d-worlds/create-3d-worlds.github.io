import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/planets.js'

renderer.setClearColor('#121212', 1)
camera.position.set(30, 5, 35)

const sun = createSun({ r: 10 })
scene.add(sun)

createSpotlights(scene) // illuminate the sun

function createSpotlights(scene) {
  const color = 0xFFFFFF
  const intensity = 5
  const distance = 25
  const angle = Math.PI / 7

  for (let i = 0; i < 6; i++) {
    const spotlight = new THREE.SpotLight(color, intensity, distance, angle)
    const pos = i % 2 ? -25 : 25
    const x = i < 2 ? pos : 0
    const y = i >= 2 && i < 4 ? pos : 0
    const z = i >= 4 ? pos : 0
    spotlight.position.set(x, y, z)
    scene.add(spotlight)
  }
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  const time = clock.getElapsedTime()
  sun.rotation.y = time * 0.05
  renderer.render(scene, camera)
}()
