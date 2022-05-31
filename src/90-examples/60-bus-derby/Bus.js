import Physijs from '/libs/physi-ecma.js'
import * as THREE from '/node_modules/three119/build/three.module.js'
import { GLTFLoader } from '/node_modules/three119/examples/jsm/loaders/GLTFLoader.js'
import { scene } from '/utils/physics.js'

const bwf = 3.5  // bus wheel friction
const bwr = 0  // bus wheel restitution

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

export default function Bus(platformSide) {  // platformSide: "platformLeft" or "platformRight"
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
  loader.load(`./models/bus_body_${color}.glb`,
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
  const busWheelImage = './textures/bus_wheel_front_uv_fill.png'
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
