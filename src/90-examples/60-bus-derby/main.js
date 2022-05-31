import Physijs from '/libs/physi-ecma.js'
import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, renderer } from '/utils/scene.js'
import { scene } from '/utils/physics.js'
import { ambLight } from '/utils/light.js'
import Bus from './Bus.js'

const pf = 4.2  // platform friction
const pr = 0  // platform restitution
const backgroundColor = 0xCDD3D6

renderer.setClearColor (backgroundColor, 1)
camera.position.set(0, 50, 100)

ambLight({ scene, intensity: 0.85 })

// /platform
const platformDiameter = 170
const platformRadiusTop = platformDiameter * 0.5
const platformRadiusBottom = platformDiameter * 0.5 + 0.2
const platformHeight = 1
const platformSegments = 85

const platformGeometry = new THREE.CylinderGeometry(
  platformRadiusTop,
  platformRadiusBottom,
  platformHeight,
  platformSegments
)

// physi.js platform (invisible; provides structure) (separating three.js & physi.js improves peformance)
const physiPlatformMaterial = Physijs.createMaterial(
  new THREE.MeshLambertMaterial(), pf, pr
)
const physiPlatform = new Physijs.CylinderMesh(platformGeometry, physiPlatformMaterial, 0)
physiPlatform.name = 'physicalPlatform'
physiPlatform.position.set(0, -0.5, 0)
physiPlatform.visible = false
scene.add(physiPlatform)

// three.js platform (visible; provides image) (separating three.js & physi.js improves peformance)
const platformMaterialsArray = []
const platformMaterialColor = new THREE.MeshLambertMaterial({ color: 0x606060 })
platformMaterialsArray.push(platformMaterialColor)  // (materialindex = 0)
const platformImage = './textures/asphalt_texture.jpg'
const platformTextureLoader = new THREE.TextureLoader()
const ptr = 4.5  // platform texture repeat
platformTextureLoader.load(platformImage, texture => {
  // shrinks & repeats the image for the designate number of times
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(ptr, ptr)
  // sets textue
  const platformMaterialImage = new THREE.MeshLambertMaterial({ map: texture })
  platformMaterialsArray.push(platformMaterialImage)  // (materials index = 1)
})
const faceCount = platformGeometry.faces.length
for (let i = 0; i < faceCount; i++)
  if (i < platformSegments * 2)   // (cylinder side)
    platformGeometry.faces[i].materialIndex = 0
  else if (i < platformSegments * 3)   // (cylinder top)
    platformGeometry.faces[i].materialIndex = 1
  else   // (cylinder bottom)
    platformGeometry.faces[i].materialIndex = 0

const visiblePlatform = new THREE.Mesh(platformGeometry, platformMaterialsArray)
visiblePlatform.name = 'visiblePlatform'
visiblePlatform.position.set(0, -0.5, 0)
visiblePlatform.rotation.y = 0.4
visiblePlatform.receiveShadow = true
scene.add(visiblePlatform)

const greenBus = new Bus('platformLeft')
const redBus = new Bus('platformRight')

function handleKeyDown(e) {
  // .configureAngularMotor params are:
  //   1) which_motor (numbers matched to axes: 0 = x, 1 = y, 2 = z)
  //   2) low_limit
  //   3) high_limit
  //   4) velocity
  //   5) max_force
  switch (e.keyCode) {
    // BUS 1
    // pivots wheels for steering
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
    // rotates wheels for propulsion
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
    // BUS 2
    // pivots wheels for steering
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
    // rotates wheels for propulsion
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
    // BUS 1
    // sets front wheels straight again
    case 65: case 68: case 37: case 39:
      greenBus.wheel_fr_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      greenBus.wheel_fr_constraint.enableAngularMotor(1)
      greenBus.wheel_fl_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      greenBus.wheel_fl_constraint.enableAngularMotor(1)
      break
    // stops back wheel rotation
    case 87: case 83: case 38: case 40:
      greenBus.wheel_bl_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      greenBus.wheel_bl_constraint.enableAngularMotor(2)
      greenBus.wheel_br_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      greenBus.wheel_br_constraint.enableAngularMotor(2)
      break
    // BUS 2
    // sets front wheels straight again
    case 76: case 222:
      redBus.wheel_fr_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      redBus.wheel_fr_constraint.enableAngularMotor(1)
      redBus.wheel_fl_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      redBus.wheel_fl_constraint.enableAngularMotor(1)
      break
    // stops back wheel rotation
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