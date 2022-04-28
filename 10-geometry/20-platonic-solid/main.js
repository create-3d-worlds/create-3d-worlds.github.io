import * as THREE from '/node_modules/three108/build/three.module.js'
import {camera, scene, renderer, createOrbitControls} from '/utils/scene.js'

const distance = 11

createOrbitControls()

camera.position.set(0, 15, 40)
camera.lookAt(scene.position)

/* OBLICI */

const material = new THREE.MeshNormalMaterial({
  wireframe: true // bez wireframe ima boju
})

const tetrahedron = new THREE.Mesh(
  new THREE.TetrahedronGeometry(5),
  material
)
tetrahedron.position.x -= distance * 2
scene.add(tetrahedron)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5), material
)
cube.position.x -= distance
scene.add(cube)

const octahedron = new THREE.Mesh(
  new THREE.OctahedronGeometry(5), material
)
scene.add(octahedron)

const dodecahedron = new THREE.Mesh(
  new THREE.DodecahedronGeometry(5), material
)
dodecahedron.position.x += distance
scene.add(dodecahedron)

const icosahedron = new THREE.Mesh(
  new THREE.IcosahedronGeometry(5), material
)
icosahedron.position.x += distance * 2
scene.add(icosahedron)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
