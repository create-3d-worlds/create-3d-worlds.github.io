import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { handleInput } from '/utils/player.js'

camera.position.set(0, 15, 40)
camera.lookAt(scene.position)

const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
const floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const cubeMat = new THREE.MeshNormalMaterial()
const cubeGeom = new THREE.BoxGeometry(5, 5, 5, 1, 1, 1)
const player = new THREE.Mesh(cubeGeom, cubeMat)
player.position.set(0, 2.5, 0)
scene.add(player)

void function animate() {
  const delta = clock.getDelta()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  handleInput(player, delta)
}()