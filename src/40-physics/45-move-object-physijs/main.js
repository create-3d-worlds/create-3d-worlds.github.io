import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { scene, createGround, createCrate } from '/utils/physics.js'

const loader = new THREE.TextureLoader()

let box
let mouse_position
const boxes = []

camera.position.set(60, 50, 60)
camera.lookAt(scene.position)

// Light
const light = new THREE.DirectionalLight(0xFFFFFF, 0.6)
light.position.set(20, 40, -15)
light.target.position.copy(scene.position)
light.castShadow = true
scene.add(light)

scene.add(new THREE.AmbientLight('white', 0.3))

const box_material = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({ map: loader.load('/assets/textures/crate.gif') }),
  .4, // low friction
  .6 // high restitution
)
box_material.map.wrapS = THREE.RepeatWrapping
box_material.map.repeat.set(.25, .25)

const ground = createGround({ size: 100 })
scene.add(ground)

for (let i = 0; i < 10; i++) {
  box = new Physijs.BoxMesh(
    new THREE.BoxGeometry(4, 4, 4),
    box_material
  )
  box.position.set(
    Math.random() * 50 - 25,
    10 + Math.random() * 5,
    Math.random() * 50 - 25
  )
  box.rotation.set(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  )
  box.scale.set(
    Math.random() * 1 + .5,
    Math.random() * 1 + .5,
    Math.random() * 1 + .5
  )
  box.castShadow = true
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
