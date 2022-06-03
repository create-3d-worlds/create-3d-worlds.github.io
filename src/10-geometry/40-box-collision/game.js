import * as THREE from '/node_modules/three127/build/three.module.js'
import {scene, camera, renderer} from '/utils/scene.js'

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.z = 100

const box = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 20),
  new THREE.MeshBasicMaterial({color: 0xFF0000})
)
box.geometry.computeBoundingBox()

const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 20),
  new THREE.MeshBasicMaterial({color: 0x00FF00})
)
box2.position.x = 40
box2.geometry.computeBoundingBox()

scene.add(box)
scene.add(box2)

function checkForCollision() {
  const boxPosition = new THREE.Box3().setFromObject(box)
  const box2Position = new THREE.Box3().setFromObject(box2)
  const message = boxPosition.intersectsBox(box2Position) ? 'Boxes touching' : 'Boxes not touching'
  document.querySelector('h1').textContent = message
}

function checkKey(e) {
  const left = 37,
    up = 38,
    right = 39,
    down = 40,
    increment = 5

  if (e.keyCode == up) box.position.z -= increment
  if (e.keyCode == down) box.position.z += increment
  if (e.keyCode == left) box.position.x -= increment
  if (e.keyCode == right) box.position.x += increment

  checkForCollision()
}

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()

window.onkeydown = checkKey
