import * as THREE from '/node_modules/three127/build/three.module.js'

import { scene, camera, renderer } from '/utils/scene.js'
import { createParticles, resetParticles, expandParticles } from '/utils/particles.js'
import { mouseToWorld } from '/utils/helpers.js'

renderer.setClearColor(0x000000)

const particles = createParticles({ num: 30, file: 'fireball.png', color: 0xfffafa, size: 0.4, unitAngle: 0.1 })
scene.add(particles)

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  expandParticles({ particles, scalar: 1.1 }) // scalar < 1 vraća unazad
  requestAnimationFrame(render)
}()

/* EVENT */

document.addEventListener('click', e => {
  const { x, y, z } = mouseToWorld(e, camera)
  resetParticles({ particles, pos: [x, y, z], unitAngle: 0.1 })
})