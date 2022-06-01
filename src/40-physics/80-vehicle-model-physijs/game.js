import * as THREE from '/node_modules/three119/build/three.module.js'
import { LegacyJSONLoader } from '/libs/LegacyJSONLoader.js'
import Physijs from '/libs/physi-ecma.js'
import { renderer, camera } from '/utils/scene.js'
import { scene, createGround, createCrate } from '/utils/physics.js'
import keyboard from '/classes/Keyboard.js'
import { randomInRange, randomInCircle } from '/utils/helpers.js'

const loader = new LegacyJSONLoader()

const mapRadius = 250

const input = {
  power: 0,
  direction: 0,
  steering: 0
}
let vehicle

const light = new THREE.DirectionalLight(0xFFFFFF)
scene.add(light)

const ground = createGround({ size: mapRadius, file: 'rocks.jpg' })
scene.add(ground)

for (let i = 0; i < 250; i++) {
  const size = randomInRange(.5, 5)
  const box = createCrate({ size, friction: .4, bounciness: .6 })
  const { x, z } = randomInCircle(mapRadius)
  box.position.set(x, size * .5, z)
  console.log(box.position)
  scene.add(box)
}

loader.load('models/mustang.js', (carModel, carMaterials) => {
  loader.load('models/mustang_wheel.js', (wheelModel, wheelMaterials) => {
    const mesh = new Physijs.BoxMesh(carModel, carMaterials)
    mesh.position.y = 2
    mesh.castShadow = mesh.receiveShadow = true

    vehicle = new Physijs.Vehicle(mesh, new Physijs.VehicleTuning(
      // VehicleTuning(suspension_stiffness, suspension_compression, suspension_damping, max_suspension_travel, friction_slip, max_suspension_force)
      15.88, 1.83, 15.28, 50, 10.5, 6000
    ))
    scene.add(vehicle)

    for (let i = 0; i < 4; i++) {
      const x = i % 2 === 0 ? -1.6 : 1.6
      const z = i < 2 ? 3.3 : -3.2
      vehicle.addWheel(
        wheelModel, wheelMaterials, new THREE.Vector3(x, -1, z),
        new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, 0, 0), 0.5, 0.7, i < 2 ? false : true
      )
    }
  })
})

scene.simulate()

function handleInput() {
  input.direction = keyboard.left ? 1 : keyboard.right ? -1 : 0
  input.power = keyboard.up ? 1 : keyboard.down ? -1 : 0
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  if (!vehicle) return
  camera.position.copy(vehicle.mesh.position).add(new THREE.Vector3(0, 5, -10))
  camera.lookAt(vehicle.mesh.position)
  handleInput()
  renderer.render(scene, camera)
}()

scene.addEventListener('update', () => {
  if (!vehicle) return
  const steeringLimit = .3

  if (input.direction) {
    input.steering += input.direction / 50
    if (input.steering < -steeringLimit) input.steering = -steeringLimit
    if (input.steering > steeringLimit) input.steering = steeringLimit
  }
  vehicle.setSteering(input.steering, 0) // right wheell
  vehicle.setSteering(input.steering, 1) // left wheell

  if (input.power === 1)
    vehicle.applyEngineForce(200)
  else if (input.power === -1) {
    vehicle.setBrake(20, 2)
    vehicle.setBrake(20, 3)
  } else
    vehicle.applyEngineForce(0)

  scene.simulate(undefined, 2)
})
