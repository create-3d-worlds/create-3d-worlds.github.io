import * as THREE from '/node_modules/three127/build/three.module.js'

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
  axisX.rotation.z = - Math.PI / 2
  axisX.position.x = axisLength / 2 - 1

  axisY.position.y = axisLength / 2 - 1

  axisZ.rotation.y = - Math.PI / 2
  axisZ.rotation.z = - Math.PI / 2
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
  arrowX.rotation.z = - Math.PI / 2
  arrowX.position.x = axisLength - 1 + axisRadius * 4 / 2

  arrowY.position.y = axisLength - 1 + axisRadius * 4 / 2

  arrowZ.rotation.z = - Math.PI / 2
  arrowZ.rotation.y = - Math.PI / 2
  arrowZ.position.z = axisLength - 1 + axisRadius * 4 / 2

  scene.add(arrowX)
  scene.add(arrowY)
  scene.add(arrowZ)
}
