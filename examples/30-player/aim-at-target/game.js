import * as THREE from 'three'
import { scene, camera, renderer } from '/core/scene.js'
import { hemLight } from '/core/light.js'

hemLight()
camera.position.set(0, 0, 7)

const gun = createGun()
scene.add(gun)

const sphere = createSphere()
scene.add(sphere)

const tetra = createTetra()
scene.add(tetra)

const box = createBox()
scene.add(box)

/* GUI */

const methods = {
  lookAtCube() {
    gun.lookAt(box.position)
  },
  lookAtTetra() {
    gun.lookAt(tetra.position)
  },
  lookAtSphere() {
    gun.lookAt(sphere.position)
  }
}

Object.keys(methods).forEach((key, i) => {
  const btn = document.createElement('button')
  btn.innerText = key
  btn.classList.add('rpgui-button')
  btn.style.position = 'absolute'
  btn.style.top = 60 * i + 'px'
  document.body.appendChild(btn)

  btn.addEventListener('pointerup', methods[key])
})

/* FUNCTIONS */

function createGun() {
  const geometry = new THREE.CylinderGeometry(.8, .5, 8, 12)
  geometry.rotateX(Math.PI / 2)
  const material = new THREE.MeshLambertMaterial({ color: 'gray' })
  material.transparent = true
  const gun = new THREE.Mesh(geometry, material)
  gun.position.y = -2
  return gun
}

function createSphere() {
  const geometry = new THREE.SphereGeometry(1, 10, 10)
  const material = new THREE.MeshLambertMaterial({ color: 'green' })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(-4, 2, -8)
  return mesh
}

function createTetra() {
  const geometry = new THREE.TetrahedronGeometry(2)
  const material = new THREE.MeshLambertMaterial({ color: 'yellow' })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(-6, 0, -4)
  return mesh
}

function createBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshLambertMaterial({ color: 'red' })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(6, 2, -8)
  return mesh
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
