// https://threejs.org/docs/#api/en/core/BufferGeometry
import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, camera, renderer, hemLight } from '/utils/scene.js'

hemLight()
const geometry = new THREE.BufferGeometry()
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array([
  -1.0, -1.0, 1.0,
	 1.0, -1.0, 1.0,
	 1.0, 1.0, 1.0,

	 1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0
])

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
