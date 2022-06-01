import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, renderer } from '/utils/scene.js'
import { scene, createGround, createCrate } from '/utils/physics.js'
import { randomInRange } from '/utils/helpers.js'
import { CIRCLE } from '/utils/constants.js'

let box
let mouse_position
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
  box.position.set(randomInRange(-25, 25), randomInRange(10, 15), randomInRange(-25, 25))
  box.rotation.set(Math.random() * CIRCLE, Math.random() * CIRCLE, Math.random() * CIRCLE)
  box.scale.set(randomInRange(.5, 1.5), randomInRange(.5, 1.5), randomInRange(.5, 1.5))
  scene.add(box)
  boxes.push(box)
}

scene.simulate()

const setMousePosition = function(evt) {
  // Find where mouse cursor intersects the ground plane
  const vector = new THREE.Vector3(
    (evt.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((evt.clientY / renderer.domElement.clientHeight) * 2 - 1),
    .5
  )
  vector.unproject(camera)
  vector.sub(camera.position).normalize()

  const coefficient = (box.position.y - camera.position.y) / vector.y
  mouse_position = camera.position.clone().add(vector.multiplyScalar(coefficient))
}

const applyForce = function() {
  if (!mouse_position) return
  const strength = 35
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i]
    const distance = mouse_position.distanceTo(box.position)
    const effect = mouse_position.clone().sub(box.position).normalize().multiplyScalar(strength / distance).negate()
    const offset = mouse_position.clone().sub(box.position)
    box.applyImpulse(effect, offset)
  }
}

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()

scene.addEventListener('update', () => {
  applyForce()
  scene.simulate(undefined, 1)
})

renderer.domElement.addEventListener('mousemove', setMousePosition)
