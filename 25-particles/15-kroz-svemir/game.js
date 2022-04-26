import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'

const stars = []
camera.position.z = 5

initStars()

function initStars() {
  for (let z = -1000; z < 1000; z += 20) {
    const geometry = new THREE.SphereGeometry(1)
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.x = Math.random() * 1000 - 500
    sphere.position.y = Math.random() * 1000 - 500
    sphere.position.z = z
    scene.add(sphere)
    stars.push(sphere)
  }
}

function animateStars() {
  stars.forEach((star, i) => {
    star.position.z += i / 10
    if (star.position.z > 1000) star.position.z -= 2000
  })
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  animateStars()
}()
