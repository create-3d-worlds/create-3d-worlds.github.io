import * as THREE from '/node_modules/three108/build/three.module.js'

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

/**
  * Update ground level
  */
export const findGround = ({ mesh, solids }, { x = 0, y = 0, z = 0 } = {}) => {
  if (!mesh || !solids.length) return
  const pos = mesh.position.clone()
  pos.x += x // adjustments
  pos.y += y
  pos.z += z
  const raycaster = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0))
  const intersects = raycaster.intersectObjects(solids)
  const groundY = intersects[0] ? intersects[0].point.y : 0
  return groundY
}
