import * as THREE from 'three'
import { camera, scene, renderer, createOrbitControls, setBackground } from '/utils/scene.js'
import { material } from '/utils/shaders/wood.js'

setBackground(0x00000)

const controls = await createOrbitControls()
camera.position.set(0, 0, 2)

const geometry = new THREE.BoxGeometry()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()