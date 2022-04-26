import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer, createOrbitControls} from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

class Rain {
  constructor() {
    this.drops = []
    this.createDrops()
  }

  createDrops(dropsNum = 1000) {
    for (let i = 0; i < dropsNum; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 5)
      const material = new THREE.MeshBasicMaterial({
        color: 0x9999ff,
        transparent: true,
        opacity: 0.6,
      })
      const drop = new THREE.Mesh(geometry, material)
      drop.scale.set(0.1, 1, 0.1)
      drop.position.x = randomInRange(-500, 500)
      drop.position.y = randomInRange(-500, 500)
      drop.position.z = randomInRange(-500, 500)
      drop.velocity = randomInRange(5, 10)
      this.drops.push(drop)
    }
  }

  update() {
    this.drops.forEach(drop => {
      drop.position.y -= drop.velocity
      if (drop.position.y < -100) drop.position.y += 1000
    })
  }
}

const rain = new Rain()
scene.add(...rain.drops)

createOrbitControls()

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  rain.update()
}()
