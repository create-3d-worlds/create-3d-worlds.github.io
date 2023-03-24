import * as THREE from 'three'
import { scene, camera, renderer } from '/utils/scene.js'

const speed = 2
const rotation = -2
const numTorus = 80
const size = 57

const toruses = []

function createTorus(t) {
  const geometry = new THREE.TorusGeometry(160, 75, 2, 13)
  const mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial())
  mesh.position.set(size * Math.cos(t), size * Math.sin(t), t * 1.25)
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