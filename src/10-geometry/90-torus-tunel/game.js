import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

createOrbitControls()

const speed = 2
const rotation = 0
const numTorus = 80
const toruses = []

const createTorus = f => {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(160, 75, 2, 13), new THREE.MeshNormalMaterial())
  mesh.position.set(57 * Math.cos(f), 57 * Math.sin(f), f * 1.25)
  return mesh
}

for (let i = 0; i < numTorus; i++) {
  toruses.push(createTorus(-i * 13))
  scene.add(toruses[i])
}

/* LOOP */

function moveTunnel() {
  toruses.forEach((mesh, i) => {
    mesh.position.z += speed
    mesh.rotation.z += i * rotation / 10000
    if (mesh.position.z > 0) mesh.position.z = -1000
  })
}

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  moveTunnel()
}()
