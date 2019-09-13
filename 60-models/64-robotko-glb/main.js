import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls} from '/utils/scene.js'
import {Player, Robotko} from '/classes/index.js'

camera.position.set(50, 10, 0)
createOrbitControls()

const player = new Player(0, 0, 0, 20, mesh => {
  mesh.rotateY(Math.PI)
  mesh.add(camera)
  scene.add(mesh)
}, Robotko)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
