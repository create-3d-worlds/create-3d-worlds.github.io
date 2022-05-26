import * as THREE from '/node_modules/three119/build/three.module.js'
import { RIGHT_ANGLE } from '/utils/constants.js'

export function drawAxes(scene) {
  const axisRadius = 1
  const axisLength = 200
  const axisTess = 50

  const axisXMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 })
  const axisYMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 })
  const axisZMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF })
  axisXMaterial.side = THREE.DoubleSide
  axisYMaterial.side = THREE.DoubleSide
  axisZMaterial.side = THREE.DoubleSide
  const axisX = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
    axisXMaterial
  )
  const axisY = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
    axisYMaterial
  )
  const axisZ = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
    axisZMaterial
  )
  axisX.rotation.z = -RIGHT_ANGLE
  axisX.position.x = axisLength / 2 - 1

  axisY.position.y = axisLength / 2 - 1

  axisZ.rotation.y = -RIGHT_ANGLE
  axisZ.rotation.z = -RIGHT_ANGLE
  axisZ.position.z = axisLength / 2 - 1

  scene.add(axisX)
  scene.add(axisY)
  scene.add(axisZ)

  const arrowX = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
    axisXMaterial
  )
  const arrowY = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
    axisYMaterial
  )
  const arrowZ = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
    axisZMaterial
  )
  arrowX.rotation.z = -RIGHT_ANGLE
  arrowX.position.x = axisLength - 1 + axisRadius * 4 / 2

  arrowY.position.y = axisLength - 1 + axisRadius * 4 / 2

  arrowZ.rotation.z = -RIGHT_ANGLE
  arrowZ.rotation.y = -RIGHT_ANGLE
  arrowZ.position.z = axisLength - 1 + axisRadius * 4 / 2

  scene.add(arrowX)
  scene.add(arrowY)
  scene.add(arrowZ)
}
