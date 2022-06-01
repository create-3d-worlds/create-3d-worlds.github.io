import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, renderer } from '/utils/scene.js'
import { scene, createGround, createCrate } from '/utils/physics.js'
import { randomInRange, mouseToWorld } from '/utils/helpers.js'

let box
let mousePos
const boxes = []

camera.position.set(30, 25, 30)
camera.lookAt(scene.position)

const light = new THREE.DirectionalLight(0xFFFFFF, 0.6)
light.position.set(20, 40, -15)
light.castShadow = true
scene.add(light)

scene.add(new THREE.AmbientLight('white', 0.3))

const ground = createGround({ size: 100 })
scene.add(ground)

for (let i = 0; i < 10; i++) {
  box = createCrate({ size: 4, mass: 64 })
  box.position.set(randomInRange(-25, 25), 2, randomInRange(-25, 25))
  scene.add(box)
  boxes.push(box)
}

const setMousePosition = function(e) {
  const mouse3D = mouseToWorld(e)
  mouse3D.sub(camera.position).normalize()

  const coefficient = (box.position.y - camera.position.y) / mouse3D.y
  mousePos = camera.position.clone().add(mouse3D.multiplyScalar(coefficient))
}

const applyForce = function() {
  if (!mousePos) return
  const strength = 35
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i]
    const distance = mousePos.distanceTo(box.position)
    const effect = mousePos.clone().sub(box.position).normalize().multiplyScalar(strength / distance).negate()
    const offset = mousePos.clone().sub(box.position)
    box.applyImpulse(effect, offset)
  }
}

/* LOOP */

scene.simulate()

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()

scene.addEventListener('update', () => {
  applyForce()
  scene.simulate(undefined, 1)
})

/* EVENT */

document.addEventListener('mousemove', setMousePosition)
