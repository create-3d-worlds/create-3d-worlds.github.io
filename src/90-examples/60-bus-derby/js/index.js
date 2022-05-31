import Physijs from '/libs/physi-ecma.js'
import * as THREE from '/node_modules/three119/build/three.module.js'
import { GLTFLoader } from '/node_modules/three119/examples/jsm/loaders/GLTFLoader.js'
import { camera, renderer } from '/utils/scene.js'
import { createScene } from '/utils/physics.js'

const bwf = 3.5  // bus wheel friction
const bwr = 0  // bus wheel restitution
const pf = 4.2  // platform friction
const pr = 0  // platform restitution
const backgroundColor = 0xCDD3D6

let busArray = []

const scene = createScene()

renderer.setClearColor (backgroundColor, 1)
camera.position.set(0, 50, 100)

const lightA1 = new THREE.AmbientLight(0xFFFFFF, 0.85)
scene.add(lightA1)
const lightD1 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
lightD1.position.set(-20, 100, 20)
lightD1.castShadow = true
scene.add(lightD1)

// /fog
scene.fog = new THREE.Fog(
  backgroundColor,
  camera.position.z + 5,
  camera.position.z + 200
)

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
const platformImage = './images/asphalt_texture.jpg'
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

busArray = []
busArray.push(new Bus('platformLeft'))
busArray.push(new Bus('platformRight'))

// /---Buses---///
function Bus(platformSide) {  // platformSide should be "platformLeft" or "platformRight"
  const bus = this
  bus.platformSide = platformSide
  bus.score = 0

  // /frame
  const bfp = (bus.platformSide == 'platformLeft' ? { x: -40, y: 3, z: 0 } : { x: 40, y: 3, z: 0 })  // bus frame position
  const busFrameGeometry = new THREE.BoxGeometry(33, 4, 5)
  const busFrameMesh = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const busFrameMaterial = Physijs.createMaterial(busFrameMesh, 0.9, 0.9)
  bus.frame = new Physijs.BoxMesh(busFrameGeometry, busFrameMaterial, 100)
  bus.frame.name = 'frame'
  bus.frame.componentOf = 'bus'
  bus.frame.position.set(bfp.x, bfp.y, bfp.z)
  bus.frame.castShadow = true

  // /interior (provides mass to body for collisions)
  const busInteriorGeometry = new THREE.BoxGeometry(33, 7, 11)
  const busInteriorMesh = new THREE.MeshStandardMaterial({ color: 0x777777 })
  const busInteriorMaterial = Physijs.createMaterial(busInteriorMesh, 50, 50)
  bus.interior = new Physijs.BoxMesh(busInteriorGeometry, busInteriorMaterial, 5000)
  bus.interior.name = 'interior'
  bus.interior.visible = false  // (if visible, edges stick out from rounded frame)
  bus.interior.componentOf = 'bus'
  bus.interior.position.set(0, 5.5, 0)
  bus.frame.add(bus.interior)

  // /body
  const color = (bus.platformSide == 'platformLeft' ? 'green' : 'red')
  const loader = new GLTFLoader()
  loader.load(
    `./gltf/bus_body_${color}.glb`,
    gltf => {
      const scale = 5.6
      bus.body = gltf.scene.children[0]
      bus.body.name = 'body'
      bus.body.componentOf = 'bus'
      bus.body.rotation.set (0, -1.5708, 0)
      bus.body.scale.set (scale, scale, scale)
      bus.body.position.set (0, 3.6, 0)
      bus.body.castShadow = true
      bus.frame.add(bus.body)
    },
  )

  // rotates platformLeft bus 180 degress so facing right bus
  if (bus.platformSide === 'platformLeft') bus.frame.rotation.y = Math.PI

  // adds all static bus parts to the scene as a single physical object
  scene.add(bus.frame)

  // /wheels
  const fr = 2  // wheel front radius
  const br = 2  // wheel back radius
  const wi = 1  // wheel width
  const segments = 50  // wheel cylinder segments (pie slices)
  const busWheelMaterialsArray = []
  const busWheelImage = './images/bus_wheel_front_uv_fill.png'
  const busWheelGeometry = new THREE.CylinderGeometry(fr, br, wi, segments)

  // wheel side & back material (color only, no image)
  const busWheelColorBaseMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 })
  const busWheelColorMaterial = Physijs.createMaterial(busWheelColorBaseMaterial, bwf, bwr)
  busWheelMaterialsArray.push(busWheelColorMaterial)  // (.materialindex = 0)

  // wheel front material (wheel image)
  const busWheelImageLoader = new THREE.TextureLoader()
  busWheelImageLoader.load(busWheelImage, texture => {
    const busWheelImageMaterial = Physijs.createMaterial(
      new THREE.MeshBasicMaterial({ map: texture }), bwf, bwr
    )
    busWheelMaterialsArray.push(busWheelImageMaterial)  // (.materialindex = 1)
  })

  // assigns each of the wheel's faces to a .materialindex
  const busWheelFaceCount = busWheelGeometry.faces.length
  for (let i = 0; i < busWheelFaceCount; i++)
    // first set of faces makes up the wheel's tread
    if (i < segments * 2)
      busWheelGeometry.faces[i].materialIndex = 0 // assigns color material index
    // second set of faces makes up the wheel's outside
    else if (i < segments * 3)
      busWheelGeometry.faces[i].materialIndex = 1 // assigns image material index
    // third set of faces makes up the wheel's inside
    else
      busWheelGeometry.faces[i].materialIndex = 0 // assigns color material index

  // wheel creation & configuration as four physi.js objects
  bus.wheel_fl = new Physijs.CylinderMesh(busWheelGeometry, busWheelMaterialsArray, 300)
  bus.wheel_fr = new Physijs.CylinderMesh(busWheelGeometry, busWheelMaterialsArray, 300)
  bus.wheel_bl = new Physijs.CylinderMesh(busWheelGeometry, busWheelMaterialsArray, 300)
  bus.wheel_br = new Physijs.CylinderMesh(busWheelGeometry, busWheelMaterialsArray, 300)

  let frontX, backX
  if (bus.platformSide === 'platformRight') {
    frontX = bfp.x - 9.5; backX = bfp.x + 9.5
  } else {
    frontX = bfp.x + 9.5; backX = bfp.x - 9.5
  }
  configureWheel(bus.wheel_fl, { x: frontX, y: 2, z: bfp.z + 5 }, 'port')
  configureWheel(bus.wheel_fr, { x: frontX, y: 2, z: bfp.z - 5 }, 'starboard')
  configureWheel(bus.wheel_bl, { x: backX, y: 2, z: bfp.z + 5 }, 'port')
  configureWheel(bus.wheel_br, { x: backX, y: 2, z: bfp.z - 5 }, 'starboard')

  // /wheel constraints
  const wheel_fl_constraint = new Physijs.DOFConstraint(bus.wheel_fl, bus.frame, bus.wheel_fl.position)
  const wheel_fr_constraint = new Physijs.DOFConstraint(bus.wheel_fr, bus.frame, bus.wheel_fr.position)
  const wheel_bl_constraint = new Physijs.DOFConstraint(bus.wheel_bl, bus.frame, bus.wheel_bl.position)
  const wheel_br_constraint = new Physijs.DOFConstraint(bus.wheel_br, bus.frame, bus.wheel_br.position)

  bus.wheel_fl_constraint = configureWheelConstraints(wheel_fl_constraint)
  bus.wheel_fr_constraint = configureWheelConstraints(wheel_fr_constraint)
  bus.wheel_bl_constraint = configureWheelConstraints(wheel_bl_constraint)
  bus.wheel_br_constraint = configureWheelConstraints(wheel_br_constraint)
}

// ///---Functions---/////

function configureWheel(wheel, position, BusSide) {
  wheel.name = 'wheel'
  wheel.componentOf = 'bus'
  BusSide === 'port' ? wheel.rotation.x = Math.PI / 2 : wheel.rotation.x = -Math.PI / 2
  wheel.position.set(position.x, position.y, position.z)
  wheel.setDamping(0.5, 0.5)
  wheel.castShadow = true
  scene.add(wheel)
}

function configureWheelConstraints(constraint) {
  scene.addConstraint(constraint)
  constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 })
  constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 })
  return constraint
}

function handleKeyDown(keyEvent) {
  // sets wheel motors; .configureAngularMotor params are:
  //   1) which_motor (as numbers matched to axes: 0 = x, 1 = y, 2 = z)
  //   2) low_limit (lower limit of the motor)
  //   3) high_limit (upper limit of the motor)
  //   4) velocity (target velocity)
  //   5) max_force (maximum force the motor can apply)
  switch (keyEvent.keyCode) {
    // BUS 1
    // pivots wheels for steering
    case 65: case 37:  // "a" key or left arrow key (turn left)
      busArray[0].wheel_fr_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, 10, 200)
      busArray[0].wheel_fr_constraint.enableAngularMotor(1)
      busArray[0].wheel_fl_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, 10, 200)
      busArray[0].wheel_fl_constraint.enableAngularMotor(1)
      break
    case 68: case 39:  // "d" key  or right arrow key (turn right)
      busArray[0].wheel_fr_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, -10, 200)
      busArray[0].wheel_fr_constraint.enableAngularMotor(1)
      busArray[0].wheel_fl_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, -10, 200)
      busArray[0].wheel_fl_constraint.enableAngularMotor(1)
      break
    // rotates wheels for propulsion
    case 87: case 38: // "w" key or up arrow key (forward)
      busArray[0].wheel_bl_constraint.configureAngularMotor(2, 1, 0, -30, 50000)
      busArray[0].wheel_bl_constraint.enableAngularMotor(2)
      busArray[0].wheel_br_constraint.configureAngularMotor(2, 1, 0, -30, 50000)
      busArray[0].wheel_br_constraint.enableAngularMotor(2)
      break
    case 83: case 40:  // "s" key or down arrow key (backward)
      busArray[0].wheel_bl_constraint.configureAngularMotor(2, 1, 0, 20, 3500)
      busArray[0].wheel_bl_constraint.enableAngularMotor(2)
      busArray[0].wheel_br_constraint.configureAngularMotor(2, 1, 0, 20, 3500)
      busArray[0].wheel_br_constraint.enableAngularMotor(2)
      break
    // BUS 2
    // pivots wheels for steering
    case 76:  // "l" key (turn left)
      busArray[1].wheel_fr_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, 10, 200)
      busArray[1].wheel_fr_constraint.enableAngularMotor(1)
      busArray[1].wheel_fl_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, 10, 200)
      busArray[1].wheel_fl_constraint.enableAngularMotor(1)
      break
    case 222:  // "'" key (turn right)
      busArray[1].wheel_fr_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, -10, 200)
      busArray[1].wheel_fr_constraint.enableAngularMotor(1)
      busArray[1].wheel_fl_constraint.configureAngularMotor(1, -Math.PI / 4, Math.PI / 4, -10, 200)
      busArray[1].wheel_fl_constraint.enableAngularMotor(1)
      break
    // rotates wheels for propulsion
    case 80:  // "p" key (forward)
      busArray[1].wheel_bl_constraint.configureAngularMotor(2, 1, 0, 30, 50000)
      busArray[1].wheel_bl_constraint.enableAngularMotor(2)
      busArray[1].wheel_br_constraint.configureAngularMotor(2, 1, 0, 30, 50000)
      busArray[1].wheel_br_constraint.enableAngularMotor(2)
      break
    case 186:  // ";" key (backward)
      busArray[1].wheel_bl_constraint.configureAngularMotor(2, 1, 0, -20, 3500)
      busArray[1].wheel_bl_constraint.enableAngularMotor(2)
      busArray[1].wheel_br_constraint.configureAngularMotor(2, 1, 0, -20, 3500)
      busArray[1].wheel_br_constraint.enableAngularMotor(2)
      break
  }
}

function handleKeyUp(keyEvent) {
  switch (keyEvent.keyCode) {
    // BUS 1
    // sets front wheels straight again
    case 65: case 68: case 37: case 39:
      busArray[0].wheel_fr_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      busArray[0].wheel_fr_constraint.enableAngularMotor(1)
      busArray[0].wheel_fl_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      busArray[0].wheel_fl_constraint.enableAngularMotor(1)
      break
    // stops back wheel rotation
    case 87: case 83: case 38: case 40:
      busArray[0].wheel_bl_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      busArray[0].wheel_bl_constraint.enableAngularMotor(2)
      busArray[0].wheel_br_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      busArray[0].wheel_br_constraint.enableAngularMotor(2)
      break
    // BUS 2
    // sets front wheels straight again
    case 76: case 222:
      busArray[1].wheel_fr_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      busArray[1].wheel_fr_constraint.enableAngularMotor(1)
      busArray[1].wheel_fl_constraint.configureAngularMotor(1, 0, 0, 10, 200)
      busArray[1].wheel_fl_constraint.enableAngularMotor(1)
      break
    // stops back wheel rotation
    case 80: case 186:
      busArray[1].wheel_bl_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      busArray[1].wheel_bl_constraint.enableAngularMotor(2)
      busArray[1].wheel_br_constraint.configureAngularMotor(2, 0, 0, 0, 2000)
      busArray[1].wheel_br_constraint.enableAngularMotor(2)
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