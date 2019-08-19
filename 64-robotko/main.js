import * as THREE from '../node_modules/three/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls} from '../utils/scene.js'
import Robotko from './Robotko.js'

camera.position.set(- 5, 3, 10)
camera.lookAt(new THREE.Vector3(0, 2, 0))

const robot = new Robotko(scene)

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  robot.upadate(delta)
  renderer.render(scene, camera)
}()
