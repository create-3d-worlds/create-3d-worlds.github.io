import * as THREE from '/node_modules/three119/build/three.module.js'
import { LegacyJSONLoader } from '/libs/LegacyJSONLoader.js'
import Physijs from '/libs/physi-ecma.js'
import { renderer, camera } from '/utils/scene.js'
import { scene, createGround, createCrate } from '/utils/physics.js'
import keyboard from '/classes/Keyboard.js'

const loader = new LegacyJSONLoader()

const input = {
  power: 0,
  direction: 0,
  steering: 0
}
let vehicle

const light = new THREE.DirectionalLight(0xFFFFFF)
scene.add(light)

const ground = createGround({ size: 300, file: 'rocks.jpg' })
scene.add(ground)

for (let i = 0; i < 50; i++) {
  const size = Math.random() * 2 + .5
  const box = createCrate({ size, friction: .4, bounciness: .6 })
  box.position.set(Math.random() * 25 - 50, 5, Math.random() * 25 - 50)
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

    camera.position.copy(vehicle.mesh.position).add(new THREE.Vector3(0, 5, -20))
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
  // vehicle.setSteering(input.steering, 1) // skretanje točkova

  if (input.power === 1)
    vehicle.applyEngineForce(300)
  else if (input.power === -1) {
    vehicle.setBrake(20, 2)
    vehicle.setBrake(20, 3)
  } else
    vehicle.applyEngineForce(0)

  scene.simulate(undefined, 2)
})
