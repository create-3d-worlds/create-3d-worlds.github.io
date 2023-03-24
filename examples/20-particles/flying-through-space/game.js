import * as THREE from 'three'
import { scene, camera, renderer } from '/utils/scene.js'
import { Stars } from '/utils/classes/Particles.js'

scene.background = new THREE.Color(0x000000)

const particles = new Stars()
scene.add(particles.mesh)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  particles.update()
  renderer.render(scene, camera)
}()
