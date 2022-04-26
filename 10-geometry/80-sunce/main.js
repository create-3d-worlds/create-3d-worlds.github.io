import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { Sky } from '/node_modules/three108/examples/jsm/objects/Sky.js'

const degToRad = deg => deg * Math.PI / 180

createOrbitControls()
createSky()

function createSky() {
  const sky = new Sky()
  sky.scale.setScalar(450000)
  scene.add(sky)

  const sun = new THREE.Vector3()
  const phi = degToRad(90 - 2)
  const theta = degToRad(180)
  sun.setFromSphericalCoords(1, phi, theta)
  const { uniforms } = sky.material
  uniforms.sunPosition.value.copy(sun)
}

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()