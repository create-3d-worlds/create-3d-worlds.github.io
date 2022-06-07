import * as THREE from 'three'
import { camera, scene, renderer } from '/utils/scene.js'

camera.position.z = 50

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(20, 20, 20),
  new THREE.MeshNormalMaterial()
)
scene.add(cube)

void function update() {
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
