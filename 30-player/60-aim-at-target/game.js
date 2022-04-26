/* global dat */
import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'

camera.position.set(10, 5, 7)
camera.lookAt(scene.position)

const cubeGeometry = new THREE.BoxGeometry(1, 1, 7)
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 'blue' })
cubeMaterial.transparent = true
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.name = 'cube'
scene.add(cube)

const sphereGeometry = new THREE.SphereGeometry(1, 10, 10)
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 'green' })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh.position.set(4, 6, -4)
scene.add(sphereMesh)

const tetraGeometry = new THREE.TetrahedronGeometry(2)
const tetraMaterial = new THREE.MeshLambertMaterial({ color: 'yellow' })
const tetraMesh = new THREE.Mesh(tetraGeometry, tetraMaterial)
tetraMesh.position.set(-6, 0, -4)
scene.add(tetraMesh)

const light1 = new THREE.SpotLight()
light1.position.set(30, 50, 30)
scene.add(light1)

const light2 = new THREE.SpotLight()
light2.position.set(-30, 50, 30)
scene.add(light2)

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshLambertMaterial({ color: 'red' })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
boxMesh.position.set(2, 4, 8)
scene.add(boxMesh)

const control = new function() {
  this.lookAtCube = function() {
    cube.lookAt(boxMesh.position)
  }
  this.lookAtSphere = function() {
    cube.lookAt(sphereMesh.position)

  }
  this.lookAtTetra = function() {
    cube.lookAt(tetraMesh.position)
  }
}

addControls(control)

function addControls(controlObject) {
  const gui = new dat.GUI()
  gui.add(controlObject, 'lookAtSphere')
  gui.add(controlObject, 'lookAtCube')
  gui.add(controlObject, 'lookAtTetra')
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
