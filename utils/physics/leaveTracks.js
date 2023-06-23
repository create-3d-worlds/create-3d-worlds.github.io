import * as THREE from 'three'
import { DecalGeometry } from '/node_modules/three/examples/jsm/geometries/DecalGeometry.js'

import { Ammo } from '/utils/physics/index.js'
import input from '/utils/io/Input.js'
import { getMesh } from '/utils/helpers.js'

const textureLoader = new THREE.TextureLoader()

const trackMaterial = new THREE.MeshPhongMaterial({
  specular: 0x444444,
  map: textureLoader.load('/assets/images/car-track.png'),
  shininess: 900,
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -4,
  wireframe: false,
  opacity: .4
})

const oldCarPos = new THREE.Vector3(0, 0, 0)
const oldCarPos2 = new THREE.Vector3(0, 0, 0)

let tracks = []
let decRot = 0

function fixAngleRad(a) {
  if (a > Math.PI) a -= Math.PI * 2
  else if (a < -Math.PI) a += Math.PI * 2
  return a
}

export function leaveTracks({ ground, scene, vehicle }) {
  const { speed, body, wheelMeshes } = vehicle
  if (!input.left && !input.right || speed < 30) return

  const groundMesh = getMesh(ground)
  const velocity = new THREE.Vector3(0, 0, 0)
  const dec = new Ammo.btVector3(0, 0, 0)
  const dec2 = new Ammo.btVector3(0, 0, 0)
  const dec3 = new Ammo.btVector3(0, 0, 0)

  const position = new THREE.Vector3(0, 0, 0)
  const orientation = new THREE.Euler(0, 0, 0, 'XYZ')
  const size = new THREE.Vector3(90, 90, 90)

  const wheelRot = body.getWorldTransform().getBasis()

  // left track
  dec.setValue(-.05, 0, .05)
  dec2.setValue(
    wheelRot.getRow(0).x() * dec.x() + wheelRot.getRow(0).y() * dec.y() + wheelRot.getRow(0).z() * dec.z(),
    wheelRot.getRow(1).x() * dec.x() + wheelRot.getRow(1).y() * dec.y() + wheelRot.getRow(1).z() * dec.z(),
    wheelRot.getRow(2).x() * dec.x() + wheelRot.getRow(2).y() * dec.y() + wheelRot.getRow(2).z() * dec.z()
  )
  dec3.setValue(
    dec2.x() + wheelMeshes[3].position.x,
    dec2.y() + wheelMeshes[3].position.y,
    dec2.z() + wheelMeshes[3].position.z
  )

  position.set(dec3.x(), Math.floor(dec3.y()), dec3.z()) // bugfix: Math.floor

  velocity.x = position.x - oldCarPos.x
  velocity.y = position.y - oldCarPos.y
  velocity.z = position.z - oldCarPos.z

  oldCarPos.x = position.x
  oldCarPos.y = position.y
  oldCarPos.z = position.z
  // angle from velocity
  decRot = -fixAngleRad(Math.atan2(velocity.z, velocity.x) + Math.PI / 2)

  orientation.set(0, decRot, 0)
  if (velocity.length() > 2) {
    velocity.x = 0
    velocity.y = 0
    velocity.z = 0
  }
  size.set(1, 1, velocity.length())

  const material = trackMaterial.clone()

  let track = new THREE.Mesh(new DecalGeometry(groundMesh, position, orientation, size), material)
  tracks.push(track)
  scene.add(track)

  // right track
  dec.setValue(.2, 0, .2)
  dec2.setValue(
    wheelRot.getRow(0).x() * dec.x() + wheelRot.getRow(0).y() * dec.y() + wheelRot.getRow(0).z() * dec.z(),
    wheelRot.getRow(1).x() * dec.x() + wheelRot.getRow(1).y() * dec.y() + wheelRot.getRow(1).z() * dec.z(),
    wheelRot.getRow(2).x() * dec.x() + wheelRot.getRow(2).y() * dec.y() + wheelRot.getRow(2).z() * dec.z()
  )
  dec3.setValue(
    dec2.x() + wheelMeshes[2].position.x,
    dec2.y() + wheelMeshes[2].position.y,
    dec2.z() + wheelMeshes[2].position.z
  )
  position.set(dec3.x(), Math.floor(dec3.y()), dec3.z()) // bugfix: Math.floor

  velocity.x = position.x - oldCarPos2.x
  velocity.y = position.y - oldCarPos2.y
  velocity.z = position.z - oldCarPos2.z

  oldCarPos2.x = position.x
  oldCarPos2.y = position.y
  oldCarPos2.z = position.z

  decRot = -fixAngleRad(Math.atan2(velocity.z, velocity.x) + Math.PI / 2)
  orientation.set(0, decRot, 0)

  if (velocity.length() > 2) {
    velocity.x = 0; velocity.y = 0; velocity.z = 0
  }
  size.set(1, 1, velocity.length())

  track = new THREE.Mesh(new DecalGeometry(groundMesh, position, orientation, size), material)
  tracks.push(track)
  scene.add(track)

  fadeTracks(scene)
}

export function fadeTracks(scene) {
  tracks.forEach(decal => {
    decal.material.opacity -= .001
    if (decal.material.opacity <= 0) scene.remove(decal)
  })
  tracks = tracks.filter(decal => decal.material.opacity > 0)
}
