import * as THREE from '/node_modules/three127/build/three.module.js'
import {camera, scene, renderer, createOrbitControls} from '/utils/scene.js'

createOrbitControls()
camera.position.set(0, 50, 250)

const tackeZvezde = [
  new THREE.Vector2(0, 50),
  new THREE.Vector2(10, 10),
  new THREE.Vector2(40, 10),
  new THREE.Vector2(20, -10),
  new THREE.Vector2(30, -50),
  new THREE.Vector2(0, -20),
  new THREE.Vector2(-30, -50),
  new THREE.Vector2(-20, -10),
  new THREE.Vector2(-40, 10),
  new THREE.Vector2(-10, 10)
]

const zvezda2D = new THREE.Shape(tackeZvezde)
const geometrija = new THREE.ExtrudeGeometry(zvezda2D, {bevelEnabled: false})
const materijali = [
  new THREE.MeshBasicMaterial({color: 0xffff00}),
  new THREE.MeshBasicMaterial({color: 0xff0000})
]
const zvezda3D = new THREE.Mesh(geometrija, materijali)
scene.add(zvezda3D)

/** LOOP **/

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
