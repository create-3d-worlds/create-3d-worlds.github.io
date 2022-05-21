import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'

camera.position.set(0, 150, 400)
createOrbitControls()

const light = new THREE.PointLight(0xffffff)
light.position.set(0, 150, 100)
scene.add(light)
const light2 = new THREE.AmbientLight(0x444444)
scene.add(light2)

const loader = new THREE.TextureLoader()
const moonTexture = loader.load('/assets/textures/moon.jpg')

/* GEOMETRIES */

const floorMaterial = new THREE.MeshBasicMaterial({ map: moonTexture })
const floorGeometry = new THREE.CircleGeometry(500, 32)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const sphereGeom = new THREE.SphereGeometry(40, 32, 32)
const moon = new THREE.Mesh(
  sphereGeom,
  new THREE.MeshBasicMaterial({ map: moonTexture })
)
moon.position.set(-100, 50, 0)
scene.add(moon)

const moon2 = new THREE.Mesh(
  sphereGeom,
  new THREE.MeshLambertMaterial({ map: moonTexture })
)
moon2.position.set(0, 50, 0)
scene.add(moon2)

const moonMaterial3 = new THREE.MeshLambertMaterial({
  map: moonTexture,
  color: 0xff8800
})
const moon3 = new THREE.Mesh(sphereGeom, moonMaterial3)
moon3.position.set(100, 50, 0)
scene.add(moon3)

const crate = new THREE.Mesh(
  new THREE.CubeGeometry(85, 85, 85),
  new THREE.MeshBasicMaterial({ map: loader.load('/assets/textures/crate.gif') })
)
crate.position.set(-60, 50, -100)
scene.add(crate)

const geometry = new THREE.CylinderGeometry(40, 40, 90, 32)
const material = new THREE.MeshBasicMaterial({ map: loader.load('/assets/textures/rust.jpg') })
const cylinder = new THREE.Mesh(geometry, material)
cylinder.position.set(60, 50, -100)
scene.add(cylinder)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
