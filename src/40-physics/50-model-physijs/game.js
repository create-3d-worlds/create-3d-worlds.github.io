import * as THREE from '/node_modules/three119/build/three.module.js'
import { LegacyJSONLoader } from '/libs/LegacyJSONLoader.js'
import Physijs from '/libs/physi-ecma.js'
import { SimplexNoise } from '/libs/SimplexNoise.js'
import { renderer, camera, createOrbitControls } from '/utils/scene.js'
import { scene, createGround } from '/utils/physics.js'

let input
let vehicle

const textureLoader = new THREE.TextureLoader()

scene.addEventListener(
  'update',
  () => {

    if (input && vehicle) {
      if (input.direction !== null) {
        input.steering += input.direction / 50
        if (input.steering < -.6) input.steering = -.6
        if (input.steering > .6) input.steering = .6
      }
      vehicle.setSteering(input.steering, 0)
      vehicle.setSteering(input.steering, 1)

      if (input.power === true)
        vehicle.applyEngineForce(300)
					 else if (input.power === false) {
        vehicle.setBrake(20, 2)
        vehicle.setBrake(20, 3)
      } else
        vehicle.applyEngineForce(0)

    }
    scene.simulate(undefined, 2)
  }
)

// Light
const light = new THREE.DirectionalLight(0xFFFFFF)
light.position.set(20, 20, -15)
light.target.position.copy(scene.position)
light.castShadow = true
scene.add(light)

// Materials
const ground_material = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({ map: textureLoader.load('/assets/textures/rocks.jpg') }),
  .8, // high friction
  .4 // low restitution
)
ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping
ground_material.map.repeat.set(3, 3)

const box_material = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({ map: textureLoader.load('/assets/textures/wood_1024.png') }),
  .4, // low friction
  .6 // high restitution
)
box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping
box_material.map.repeat.set(.25, .25)

// Ground
const NoiseGen = new SimplexNoise()

const ground_geometry = new THREE.PlaneGeometry(300, 300, 100, 100)
for (let i = 0; i < ground_geometry.vertices.length; i++) {
  const vertex = ground_geometry.vertices[i]
  vertex.y = NoiseGen.noise(vertex.x / 30, vertex.z / 30) * 1
}

ground_geometry.computeFaceNormals()
ground_geometry.computeVertexNormals()

// If your plane is not square as far as face count then the HeightfieldMesh
// takes two more arguments at the end: # of x faces and # of z faces that were passed to THREE.PlaneMaterial
const ground = new Physijs.HeightfieldMesh(
  ground_geometry,
  ground_material,
  0 // mass
)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

for (let i = 0; i < 50; i++) {
  const size = Math.random() * 2 + .5
  const box = new Physijs.BoxMesh(
    new THREE.CubeGeometry(size, size, size),
    box_material
  )
  box.castShadow = box.receiveShadow = true
  box.position.set(
    Math.random() * 25 - 50,
    5,
    Math.random() * 25 - 50
  )
  scene.add(box)
}

const loader = new LegacyJSONLoader()

loader.load('models/mustang.js', (car, car_materials) => {
  loader.load('models/mustang_wheel.js', (wheel, wheel_materials) => {
    const mesh = new Physijs.BoxMesh(
      car,
      car_materials
    )
    mesh.position.y = 2
    mesh.castShadow = mesh.receiveShadow = true

    vehicle = new Physijs.Vehicle(mesh, new Physijs.VehicleTuning(
      10.88,
      1.83,
      0.28,
      500,
      10.5,
      6000
    ))
    scene.add(vehicle)

    window.vehicle = vehicle
    window.scene = scene

    const wheel_material = new THREE.MeshFaceMaterial(wheel_materials)

    for (let i = 0; i < 4; i++)
      vehicle.addWheel(
        wheel,
        wheel_material,
        new THREE.Vector3(
          i % 2 === 0 ? -1.6 : 1.6,
          -1,
          i < 2 ? 3.3 : -3.2
        ),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(-1, 0, 0),
        0.5,
        0.7,
        i < 2 ? false : true
      )

    input = {
      power: null,
      direction: null,
      steering: 0
    }
    document.addEventListener('keydown', ev => {
      switch (ev.keyCode) {
        case 37: // left
          input.direction = 1
          break

        case 38: // forward
          input.power = true
          break

        case 39: // right
          input.direction = -1
          break

        case 40: // back
          input.power = false
          break
      }
    })
    document.addEventListener('keyup', ev => {
      switch (ev.keyCode) {
        case 37: // left
          input.direction = null
          break

        case 38: // forward
          input.power = null
          break

        case 39: // right
          input.direction = null
          break

        case 40: // back
          input.power = null
          break
      }
    })
  })
})

requestAnimationFrame(render)
scene.simulate()

function render() {
  requestAnimationFrame(render)
  if (vehicle) {
    camera.position.copy(vehicle.mesh.position).add(new THREE.Vector3(40, 25, 40))
    camera.lookAt(vehicle.mesh.position)

    light.target.position.copy(vehicle.mesh.position)
    light.position.addVectors(light.target.position, new THREE.Vector3(20, 20, -15))
  }
  renderer.render(scene, camera)
};
