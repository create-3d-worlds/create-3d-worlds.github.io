import * as THREE from '/node_modules/three119/build/three.module.js'
import { LegacyJSONLoader } from '/libs/LegacyJSONLoader.js'
import Physijs from '/libs/physi-ecma.js'
import { renderer, camera } from '/utils/scene.js'
import { scene, createGround, createCrate } from '/utils/physics.js'
import keyboard from '/classes/Keyboard.js'
import { randomInRange, randomInCircle } from '/utils/helpers.js'

const loader = new LegacyJSONLoader()

const mapRadius = 150

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

// TODO: move to utils
for (let i = 0; i < 250; i++) {
  const size = randomInRange(.5, 5)
  const box = createCrate({ size, friction: .4, bounciness: .6 })
  const { x, z } = randomInCircle(mapRadius)
  box.position.set(x, 5, z)
  console.log(box.position)
  scene.add(box)
}

loader.load('models/mustang.js', (carModel, carMaterials) => {
  loader.load('models/mustang_wheel.js', (wheelModel, wheelMaterials) => {
    const mesh = new Physijs.BoxMesh(carModel, carMaterials)
    mesh.position.y = 2
    mesh.castShadow = mesh.receiveShadow = true

    vehicle = new Physijs.Vehicle(mesh, new Physijs.VehicleTuning(
      10.88, 1.83, 0.28, 500, 10.5, 6000
    ))
    scene.add(vehicle)

    camera.position.copy(vehicle.mesh.position).add(new THREE.Vector3(0, 5, -10))
    camera.lookAt(vehicle.mesh.position)
    vehicle.mesh.add(camera)

    for (let i = 0; i < 4; i++) vehicle.addWheel(
      wheelModel, wheelMaterials, new THREE.Vector3(
        i % 2 === 0 ? -1.6 : 1.6, -1, i < 2 ? 3.3 : -3.2
      ),
      new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, 0, 0), 0.5, 0.7, i < 2 ? false : true
    )
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
  handleInput()
  renderer.render(scene, camera)
}()

scene.addEventListener('update', () => {
  if (!vehicle) return

  if (input.direction) {
    input.steering += input.direction / 50
    if (input.steering < -.6) input.steering = -.6
    if (input.steering > .6) input.steering = .6
  }
  vehicle.setSteering(input.steering, 0)
  // vehicle.setSteering(input.steering, 1)

  if (input.power === 1)
    vehicle.applyEngineForce(300)
  else if (input.power === -1) {
    vehicle.setBrake(20, 2)
    vehicle.setBrake(20, 3)
  } else
    vehicle.applyEngineForce(0)

  scene.simulate(undefined, 2)
})
