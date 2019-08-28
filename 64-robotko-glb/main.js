import * as THREE from '../node_modules/three/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls} from '../utils/scene.js'
import {Player, Robot} from '../classes/index.js'

camera.position.set(- 5, 3, 10)
camera.lookAt(new THREE.Vector3(0, 2, 0))
createOrbitControls()

// const player = new Robotko(scene)
const player = new Player(100, 50, -50, 20, mesh => {
  mesh.rotateY(Math.PI)
  mesh.add(camera)
  scene.add(mesh)
}, Robot)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.upadate(delta)
  renderer.render(scene, camera)
}()
