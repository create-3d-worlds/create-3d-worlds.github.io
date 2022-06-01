import { camera, renderer } from '/utils/scene.js'
import { scene, createGround } from '/utils/physics.js'
import { ambLight } from '/utils/light.js'
import { createBus } from './bus.js'

camera.position.set(0, 50, 100)

ambLight({ scene, intensity: 0.85 })

const ground = createGround({ friction: 4.2, bounciness: 0, file: 'asphalt.jpg' })
scene.add(ground)

const greenBus = createBus('green')
const redBus = createBus('red')

/* EVENTS */

const turn = ({ bus, limit, velocity, maxForce }) => {
  bus.wheel_fr_constraint.configureAngularMotor(1, -limit, limit, velocity, maxForce)
  bus.wheel_fr_constraint.enableAngularMotor(1)
  bus.wheel_fl_constraint.configureAngularMotor(1, -limit, limit, velocity, maxForce)
  bus.wheel_fl_constraint.enableAngularMotor(1)
}

const move = ({ bus, lowLimit, velocity, maxForce }) => {
  bus.wheel_bl_constraint.configureAngularMotor(2, lowLimit, 0, velocity, maxForce)
  bus.wheel_bl_constraint.enableAngularMotor(2)
  bus.wheel_br_constraint.configureAngularMotor(2, lowLimit, 0, velocity, maxForce)
  bus.wheel_br_constraint.enableAngularMotor(2)
}

function handleKeyDown(e) {
  switch (e.keyCode) {
    case 65: case 37:  // "a" key or left arrow
      turn({ bus: greenBus, limit: Math.PI / 4, velocity: 10, maxForce: 200 })
      break
    case 68: case 39:  // "d" key  or right arrow
      turn({ bus: greenBus, limit: Math.PI / 4, velocity: -10, maxForce: 200 })
      break
    case 87: case 38: // "w" key or up arrow
      move({ bus: greenBus, lowLimit: 1, velocity: -30, maxForce: 50000 })
      break
    case 83: case 40:  // "s" key or down arrow
      move({ bus: greenBus, lowLimit: 1, velocity: 20, maxForce: 3500 })
      break

    case 76:  // "l" key
      turn({ bus: redBus, limit: Math.PI / 4, velocity: 10, maxForce: 200 })
      break
    case 222:  // "'" key
      turn({ bus: redBus, limit: Math.PI / 4, velocity: -10, maxForce: 200 })
      break
    case 80:  // "p" key
      move({ bus: redBus, lowLimit: 1, velocity: 30, maxForce: 50000 })
      break
    case 186:  // ";" key
      move({ bus: redBus, lowLimit: 1, velocity: -20, maxForce: 3500 })
      break
  }
}

function handleKeyUp(e) {
  switch (e.keyCode) {
    case 65: case 68: case 37: case 39:
      greenBus.wheel_fr_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      greenBus.wheel_fr_constraint.enableAngularMotor(1)
      greenBus.wheel_fl_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      greenBus.wheel_fl_constraint.enableAngularMotor(1)
      break
    case 87: case 83: case 38: case 40:
      greenBus.wheel_bl_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      greenBus.wheel_bl_constraint.enableAngularMotor(2)
      greenBus.wheel_br_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      greenBus.wheel_br_constraint.enableAngularMotor(2)
      break

    case 76: case 222:
      redBus.wheel_fr_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      redBus.wheel_fr_constraint.enableAngularMotor(1)
      redBus.wheel_fl_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      redBus.wheel_fl_constraint.enableAngularMotor(1)
      break
    case 80: case 186:
      redBus.wheel_bl_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      redBus.wheel_bl_constraint.enableAngularMotor(2)
      redBus.wheel_br_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      redBus.wheel_br_constraint.enableAngularMotor(2)
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