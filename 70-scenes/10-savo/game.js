import * as THREE from '/node_modules/three/build/three.module.js'
import { createFloor } from '/utils/floor.js'
import { createMap } from '/utils/boxes.js'
import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import matrix from '/data/small-map.js'
import canvas from '/classes/2d/Canvas.js'

canvas.renderMap(matrix, 30)
canvas.style.position = 'absolute'
canvas.style.left = 0
canvas.style.backgroundColor = 'transparent'

const slika = document.getElementById('savo')
const x = window.innerWidth / 2 - slika.width / 2
const y = window.innerHeight - slika.height
canvas.ctx.drawImage(slika, x, y)

createOrbitControls()

const floor = createFloor()
scene.add(floor)
const walls = createMap(matrix, 20)
scene.add(walls)

camera.position.z = 15
camera.position.y = 10

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
