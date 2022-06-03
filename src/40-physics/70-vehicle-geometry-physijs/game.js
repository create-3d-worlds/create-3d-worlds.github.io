import * as THREE from '/node_modules/three127/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { renderer, camera } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { RIGHT_ANGLE } from '/utils/constants.js'
import { scene, createGround } from '/utils/physics.js'

scene.addEventListener('update', () => scene.simulate(undefined, 2))

camera.position.set(30, 25, 30)
camera.lookAt(scene.position)

dirLight({ scene, position: [20, 40, -15] })

const ground = createGround({ friction: 1.5, bounciness: .4, file: 'rocks.jpg' })
scene.add(ground)

const car = addCar(scene)
scene.simulate()

/* FUNCTIONS */

function addCar(scene) {
  const car = {}
  const carMaterial = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ color: 0xff6666 }),
    .8, // high friction
    .2 // low restitution
  )

  const wheelMaterial = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ color: 0x444444 }),
    .8, // high friction
    .5 // medium restitution
  )
  const wheelGeometry = new THREE.CylinderGeometry(2, 2, 1, 8)
  car.body = new Physijs.BoxMesh(
    new THREE.BoxGeometry(10, 5, 7),
    carMaterial,
    1000
  )
  car.body.position.y = 10
  car.body.receiveShadow = car.body.castShadow = true
  scene.add(car.body)

  car.wheelFl = new Physijs.CylinderMesh(
    wheelGeometry,
    wheelMaterial,
    500
  )
  car.wheelFl.rotation.x = RIGHT_ANGLE
  car.wheelFl.position.set(-3.5, 6.5, 5)
  car.wheelFl.receiveShadow = car.wheelFl.castShadow = true
  scene.add(car.wheelFl)
  car.wheelFlConstraint = new Physijs.DOFConstraint(
    car.wheelFl, car.body, new THREE.Vector3(-3.5, 6.5, 5)
  )
  scene.addConstraint(car.wheelFlConstraint)
  car.wheelFlConstraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 })
  car.wheelFlConstraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 })

  car.wheelFr = new Physijs.CylinderMesh(
    wheelGeometry,
    wheelMaterial,
    500
  )
  car.wheelFr.rotation.x = RIGHT_ANGLE
  car.wheelFr.position.set(-3.5, 6.5, -5)
  car.wheelFr.receiveShadow = car.wheelFr.castShadow = true
  scene.add(car.wheelFr)
  car.wheelFrConstraint = new Physijs.DOFConstraint(
    car.wheelFr, car.body, new THREE.Vector3(-3.5, 6.5, -5)
  )
  scene.addConstraint(car.wheelFrConstraint)
  car.wheelFrConstraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 })
  car.wheelFrConstraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 })

  car.wheelBl = new Physijs.CylinderMesh(
    wheelGeometry,
    wheelMaterial,
    500
  )
  car.wheelBl.rotation.x = RIGHT_ANGLE
  car.wheelBl.position.set(3.5, 6.5, 5)
  car.wheelBl.receiveShadow = car.wheelBl.castShadow = true
  scene.add(car.wheelBl)
  car.wheelBlConstraint = new Physijs.DOFConstraint(
    car.wheelBl, car.body, new THREE.Vector3(3.5, 6.5, 5)
  )
  scene.addConstraint(car.wheelBlConstraint)
  car.wheelBlConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 })
  car.wheelBlConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 })

  car.wheelBr = new Physijs.CylinderMesh(
    wheelGeometry,
    wheelMaterial,
    500
  )
  car.wheelBr.rotation.x = RIGHT_ANGLE
  car.wheelBr.position.set(3.5, 6.5, -5)
  car.wheelBr.receiveShadow = car.wheelBr.castShadow = true
  scene.add(car.wheelBr)
  car.wheelBrConstraint = new Physijs.DOFConstraint(
    car.wheelBr, car.body, new THREE.Vector3(3.5, 6.5, -5)
  )
  scene.addConstraint(car.wheelBrConstraint)
  car.wheelBrConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 })
  car.wheelBrConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 })
  return car
}

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'ArrowLeft':
      car.wheelFlConstraint.configureAngularMotor(1, -RIGHT_ANGLE, RIGHT_ANGLE, 1, 200)
      car.wheelFrConstraint.configureAngularMotor(1, -RIGHT_ANGLE, RIGHT_ANGLE, 1, 200)
      car.wheelFlConstraint.enableAngularMotor(1)
      car.wheelFrConstraint.enableAngularMotor(1)
      break

    case 'ArrowRight':
      car.wheelFlConstraint.configureAngularMotor(1, -RIGHT_ANGLE, RIGHT_ANGLE, -1, 200)
      car.wheelFrConstraint.configureAngularMotor(1, -RIGHT_ANGLE, RIGHT_ANGLE, -1, 200)
      car.wheelFlConstraint.enableAngularMotor(1)
      car.wheelFrConstraint.enableAngularMotor(1)
      break

    case 'ArrowUp':
      car.wheelBlConstraint.configureAngularMotor(2, 1, 0, 5, 2000)
      car.wheelBrConstraint.configureAngularMotor(2, 1, 0, 5, 2000)
      car.wheelBlConstraint.enableAngularMotor(2)
      car.wheelBrConstraint.enableAngularMotor(2)
      break

    case 'ArrowDown':
      car.wheelBlConstraint.configureAngularMotor(2, 1, 0, -5, 2000)
      car.wheelBrConstraint.configureAngularMotor(2, 1, 0, -5, 2000)
      car.wheelBlConstraint.enableAngularMotor(2)
      car.wheelBrConstraint.enableAngularMotor(2)
      break
  }
})

document.addEventListener('keyup', e => {
  switch (e.code) {
    case 'ArrowLeft':
      car.wheelFlConstraint.disableAngularMotor(1)
      car.wheelFrConstraint.disableAngularMotor(1)
      break

    case 'ArrowRight':
      car.wheelFlConstraint.disableAngularMotor(1)
      car.wheelFrConstraint.disableAngularMotor(1)
      break

    case 'ArrowUp':
      car.wheelBlConstraint.disableAngularMotor(2)
      car.wheelBrConstraint.disableAngularMotor(2)
      break

    case 'ArrowDown':
      car.wheelBlConstraint.disableAngularMotor(2)
      car.wheelBrConstraint.disableAngularMotor(2)
      break
  }
})
