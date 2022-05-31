import { camera, renderer } from '/utils/scene.js'
import { scene, createGround } from '/utils/physics.js'
import { ambLight } from '/utils/light.js'
import { createBus } from './bus.js'

const backgroundColor = 0xCDD3D6

renderer.setClearColor (backgroundColor, 1)
camera.position.set(0, 50, 100)

ambLight({ scene, intensity: 0.85 })

// TODO: okruglo tlo, ponavljanje texture
const ground = createGround({ friction: 4.2, bounciness: 0, file: 'asphalt.jpg' })
scene.add(ground)

const greenBus = createBus('green')
const redBus = createBus('red')

/* EVENTS */

function handleKeyDown(e) {
  // configureAngularMotor(which_motor, low_limit, high_limit, target_velocity, max_force)
  // (motor numbers matched to axes: 0 = x, 1 = y, 2 = z)
  switch (e.keyCode) {
    case 65: case 37:  // "a" key or left arrow key (turn left)
      greenBus.wheel_fr_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, 10, 200)
      greenBus.wheel_fr_constraint.enableAngularMotor(1)
      greenBus.wheel_fl_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, 10, 200)
      greenBus.wheel_fl_constraint.enableAngularMotor(1)
      break
    case 68: case 39:  // "d" key  or right arrow key (turn right)
      greenBus.wheel_fr_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, -10, 200)
      greenBus.wheel_fr_constraint.enableAngularMotor(1)
      greenBus.wheel_fl_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, -10, 200)
      greenBus.wheel_fl_constraint.enableAngularMotor(1)
      break
    case 87: case 38: // "w" key or up arrow key (forward)
      greenBus.wheel_bl_constraint.configureAngularMotor(2, 1, 0, -30, 50000)
      greenBus.wheel_bl_constraint.enableAngularMotor(2)
      greenBus.wheel_br_constraint.configureAngularMotor(2, 1, 0, -30, 50000)
      greenBus.wheel_br_constraint.enableAngularMotor(2)
      break
    case 83: case 40:  // "s" key or down arrow key (backward)
      greenBus.wheel_bl_constraint.configureAngularMotor(2, 1, 0, 20, 3500)
      greenBus.wheel_bl_constraint.enableAngularMotor(2)
      greenBus.wheel_br_constraint.configureAngularMotor(2, 1, 0, 20, 3500)
      greenBus.wheel_br_constraint.enableAngularMotor(2)
      break

    case 76:  // "l" key (turn left)
      redBus.wheel_fr_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, 10, 200)
      redBus.wheel_fr_constraint.enableAngularMotor(1)
      redBus.wheel_fl_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, 10, 200)
      redBus.wheel_fl_constraint.enableAngularMotor(1)
      break
    case 222:  // "'" key (turn right)
      redBus.wheel_fr_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, -10, 200)
      redBus.wheel_fr_constraint.enableAngularMotor(1)
      redBus.wheel_fl_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, -10, 200)
      redBus.wheel_fl_constraint.enableAngularMotor(1)
      break
    case 80:  // "p" key (forward)
      redBus.wheel_bl_constraint.configureAngularMotor(2, 1, 0, 30, 50000)
      redBus.wheel_bl_constraint.enableAngularMotor(2)
      redBus.wheel_br_constraint.configureAngularMotor(2, 1, 0, 30, 50000)
      redBus.wheel_br_constraint.enableAngularMotor(2)
      break
    case 186:  // ";" key (backward)
      redBus.wheel_bl_constraint.configureAngularMotor(2, 1, 0, -20, 3500)
      redBus.wheel_bl_constraint.enableAngularMotor(2)
      redBus.wheel_br_constraint.configureAngularMotor(2, 1, 0, -20, 3500)
      redBus.wheel_br_constraint.enableAngularMotor(2)
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