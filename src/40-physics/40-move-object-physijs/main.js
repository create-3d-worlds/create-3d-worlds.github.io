// https://rawgit.com/mmmovania/Physijs_Tutorials/master/SimpleBall.html
import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createScene } from '/utils/physics.js'

let ball

const forceAmount = 100

camera.position.z = 10
camera.position.y = 5

const controls = createOrbitControls()

const scene = createScene()

// floor
const friction = 1 // high friction
const restitution = 0.3 // low restitution

const material = Physijs.createMaterial(
  new THREE.MeshPhongMaterial({ color: 0x666666 }),
  friction,
  restitution
)
const floor = new Physijs.BoxMesh(
  new THREE.CubeGeometry(50, 0.1, 50),
  material,
  0 // mass
)
floor.receiveShadow = true
floor.position.set(0, 0, 0)
scene.add(floor)

addBall(new THREE.Vector3(0, 5, 0))

const ambientLight = new THREE.AmbientLight(0x707070)
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-10, 18, 5)
light.castShadow = true
scene.add(light)

document.addEventListener('keydown', event => {
  const key = event.keyCode
  const movement = new THREE.Vector3(0, 0, 0)
  switch (key) {
    case 87: { // w key pressed
      movement.z = -1 * forceAmount
      break
    }
    case 83: { // s key pressed
      movement.z = 1 * forceAmount
      break
    }
    case 65: { // a key pressed
      movement.x = -1 * forceAmount
      break
    }
    case 68: { // d key pressed
      movement.x = 1 * forceAmount
      break
    }
  }
  ball.applyForce(movement, new THREE.Vector3(0, 1, 0))
})

function addBall(pos) {
  const geometry = new THREE.SphereGeometry(1, 32, 32)

  const friction = 0.8 // high friction
  const restitution = 0.8 // low restitution

  const material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    friction,
    restitution
  )

  ball = new Physijs.SphereMesh(geometry, material, 5)
  ball.position.copy(pos)
  ball.castShadow = true
  scene.add(ball)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const deltaTime = clock.getDelta()
  controls.update(deltaTime)
  scene.simulate()
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()
