import * as THREE from '/node_modules/three127/build/three.module.js'

/**
   * Add solid objects for player to collide
   * @param {array} oldSolids pass by reference
   * @param {any} newSolids mesh group, array or a single mesh
   */
export const addSolids = (oldSolids, ...newSolids) => {
  newSolids.forEach(solid => {
    if (solid.children && solid.children.length) oldSolids.push(...solid.children)
    else if (solid.length) oldSolids.push(...solid)
    else oldSolids.push(solid)
  })
}

export const raycast = ({ mesh, solids }, direction) => {
  if (!mesh || !solids.length) return Infinity
  const pos = mesh.position.clone()
  const raycaster = new THREE.Raycaster(pos, direction)
  const intersects = raycaster.intersectObjects(solids)

  const target = intersects[0] ? intersects[0].point : null
  const distance = target ? pos.distanceTo(target) : Infinity
  return distance
}

export const raycastDown = ({ mesh, solids }) => {
  const direction = new THREE.Vector3(0, -1, 0)
  return raycast({ mesh, solids }, direction)
}

export const raycastFront = ({ mesh, solids }) => {
  if (!mesh) return
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(mesh.quaternion)
  return raycast({ mesh, solids }, direction)
}

// TODO: deprecated, find and replace with raycastDown
export const raycastGround = ({ mesh, solids }, { x = 0, y = 0, z = 0 } = {}) => {
  if (!mesh || !solids.length) return 0
  const pos = mesh.position.clone()
  pos.x += x // adjustments
  pos.y += y
  pos.z += z
  const rayDown = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0))
  const intersects = rayDown.intersectObjects(solids)

  const groundY = intersects[0] ? intersects[0].point.y : 0
  return groundY
}
