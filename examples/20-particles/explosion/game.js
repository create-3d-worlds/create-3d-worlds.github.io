import * as THREE from 'three'
import { scene, camera, renderer } from '/utils/scene.js'
import { normalizeMouse } from '/utils/helpers.js'
import { Explosion } from '/utils/Particles.js'

renderer.setClearColor(0x000000)

const explosion = new Explosion()
scene.add(explosion.mesh)

const mouseToWorld = (e, camera, z = .9) => {
  const { x, y } = normalizeMouse(e)
  const mouse3D = new THREE.Vector3(x, y, z)
  mouse3D.unproject(camera)
  return mouse3D
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  explosion.expand({ velocity: 1.1 })
  requestAnimationFrame(render)
}()

/* EVENT */

document.addEventListener('click', e => {
  explosion.reset({ pos: mouseToWorld(e, camera), unitAngle: 0.1 })
})