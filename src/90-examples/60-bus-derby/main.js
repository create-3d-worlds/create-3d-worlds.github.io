import { camera, renderer } from '/utils/scene.js'
import { scene, createGround } from '/utils/physics.js'
import { ambLight } from '/utils/light.js'
import { createBus } from './bus.js'
import keyboard from '/classes/Keyboard.js'

const { pressed } = keyboard

camera.position.set(0, 50, 100)

ambLight({ scene, intensity: 0.85 })

const ground = createGround({ friction: 4.2, bounciness: .1, file: 'asphalt.jpg' })
scene.add(ground)

const greenBus = await createBus('green')
const redBus = await createBus('red')

const turn = ({ bus, limit, velocity, maxForce }) => {
  bus.frontRightWheel.configureAngularMotor(1, -limit, limit, velocity, maxForce)
  bus.frontRightWheel.enableAngularMotor(1)
  bus.frontLeftWheel.configureAngularMotor(1, -limit, limit, velocity, maxForce)
  bus.frontLeftWheel.enableAngularMotor(1)
}

const move = ({ bus, limit, velocity, maxForce }) => {
  bus.backLeftWheel.configureAngularMotor(2, limit, 0, velocity, maxForce)
  bus.backLeftWheel.enableAngularMotor(2)
  bus.backRightWheel.configureAngularMotor(2, limit, 0, velocity, maxForce)
  bus.backRightWheel.enableAngularMotor(2)
}

/* INPUT */

function handleInput() {
  if (keyboard.up) move({ bus: greenBus, limit: 1, velocity: -15, maxForce: 500 })
  if (keyboard.down) move({ bus: greenBus, limit: 1, velocity: 10, maxForce: 350 })
  if (keyboard.left) turn({ bus: greenBus, limit: Math.PI / 4, velocity: 5, maxForce: 50 })
  if (keyboard.right) turn({ bus: greenBus, limit: Math.PI / 4, velocity: -5, maxForce: 50 })

  if (pressed.KeyP) move({ bus: redBus, limit: 1, velocity: 15, maxForce: 500 })
  if (pressed.Semicolon) move({ bus: redBus, limit: 1, velocity: -10, maxForce: 350 })
  if (pressed.KeyL) turn({ bus: redBus, limit: Math.PI / 4, velocity: 5, maxForce: 50 })
  if (pressed.Quote) turn({ bus: redBus, limit: Math.PI / 4, velocity: -5, maxForce: 50 })
}

/* LOOP */

void function render() {
  scene.simulate()
  camera.lookAt(0, 1, 0)
  handleInput()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()

/* EVENTS */

document.onkeyup = () => {
  if (!keyboard.left || !keyboard.right) turn({ bus: greenBus, limit: 0, velocity: 5, maxForce: 50 })
  if (!keyboard.up || !keyboard.down) move({ bus: greenBus, limit: 0, velocity: 0, maxForce: 50 })
  if (!pressed.KeyL || !pressed.Quote) turn({ bus: redBus, limit: 0, velocity: 5, maxForce: 50 })
  if (!pressed.KeyP || !pressed.Semicolon) move({ bus: redBus, limit: 0, velocity: 0, maxForce: 50 })
}
