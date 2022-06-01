import { camera, renderer } from '/utils/scene.js'
import { scene, createGround } from '/utils/physics.js'
import { ambLight } from '/utils/light.js'
import { createBus } from './bus.js'

camera.position.set(0, 50, 100)

ambLight({ scene, intensity: 0.85 })

const ground = createGround({ friction: 4.2, bounciness: .1, file: 'asphalt.jpg' })
scene.add(ground)

const greenBus = createBus('green')
const redBus = createBus('red')

const turn = ({ bus, limit, velocity, maxForce }) => {
  bus.frontRightWheel.configureAngularMotor(1, -limit, limit, velocity, maxForce)
  bus.frontRightWheel.enableAngularMotor(1)
  bus.frontLeftWheel.configureAngularMotor(1, -limit, limit, velocity, maxForce)
  bus.frontLeftWheel.enableAngularMotor(1)
}

const move = ({ bus, lowLimit, velocity, maxForce }) => {
  bus.backLeftWheel.configureAngularMotor(2, lowLimit, 0, velocity, maxForce)
  bus.backLeftWheel.enableAngularMotor(2)
  bus.backRightWheel.configureAngularMotor(2, lowLimit, 0, velocity, maxForce)
  bus.backRightWheel.enableAngularMotor(2)
}

/* EVENTS */

function handleKeyDown(e) {
  switch (e.code) {
    case 'KeyA': case 'ArrowLeft':
      turn({ bus: greenBus, limit: Math.PI / 4, velocity: 10, maxForce: 200 })
      break
    case 'KeyD': case 'ArrowRight':
      turn({ bus: greenBus, limit: Math.PI / 4, velocity: -10, maxForce: 200 })
      break
    case 'KeyW': case 'ArrowUp':
      move({ bus: greenBus, lowLimit: 1, velocity: -30, maxForce: 50000 })
      break
    case 'KeyS': case 'ArrowDown':
      move({ bus: greenBus, lowLimit: 1, velocity: 20, maxForce: 3500 })
      break

    case 'KeyL':
      turn({ bus: redBus, limit: Math.PI / 4, velocity: 10, maxForce: 200 })
      break
    case 'Quote':
      turn({ bus: redBus, limit: Math.PI / 4, velocity: -10, maxForce: 200 })
      break
    case 'KeyP':
      move({ bus: redBus, lowLimit: 1, velocity: 30, maxForce: 50000 })
      break
    case 'Semicolon':
      move({ bus: redBus, lowLimit: 1, velocity: -20, maxForce: 3500 })
      break
  }
}

function handleKeyUp(e) {
  switch (e.code) {
    case 'KeyA': case 'KeyD': case 'ArrowLeft': case 'ArrowRight':
      turn({ bus: greenBus, limit: 0, velocity: 10, maxForce: 200 })
      break
    case 'KeyW': case 'KeyS': case 'ArrowUp': case 'ArrowDown':
      move({ bus: greenBus, lowLimit: 0, velocity: 0, maxForce: 2000 })
      break

    case 'KeyL': case 'Quote':
      turn({ bus: redBus, limit: 0, velocity: 10, maxForce: 200 })
      break
    case 'KeyP': case 'Semicolon':
      move({ bus: redBus, lowLimit: 0, velocity: 0, maxForce: 2000 })
      break
  }
}

document.onkeydown = handleKeyDown
document.onkeyup = handleKeyUp

/* LOOP */

void function render() {
  scene.simulate()
  camera.lookAt(0, 1, 0)
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()