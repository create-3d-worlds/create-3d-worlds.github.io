import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

const size = 500
const dropsNum = 1000

createOrbitControls()

const drops = createDrops()
scene.add(...drops)

function createDrops() {
  const drops = []
  for (let i = 0; i < dropsNum; i++) {
    const geometry = new THREE.SphereGeometry(Math.random() * 5)
    const material = new THREE.MeshBasicMaterial({
      color: 0x9999ff,
      transparent: true,
      opacity: 0.6,
    })
    const drop = new THREE.Mesh(geometry, material)
    drop.scale.set(0.1, 1, 0.1)
    drop.position.set(randomInRange(-size, size), randomInRange(-size, size), randomInRange(-size, size))
    drop.velocity = randomInRange(5, 10)
    drops.push(drop)
  }
  return drops
}

function updateDrops() {
  drops.forEach(drop => {
    drop.position.y -= drop.velocity
    if (drop.position.y < -100) drop.position.y += size * 2
  })
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  updateDrops()
  renderer.render(scene, camera)
}()
