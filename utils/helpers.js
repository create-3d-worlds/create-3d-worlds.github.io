import * as THREE from '/node_modules/three108/build/three.module.js'

/* including min, not including max */
export function randomInRange(min, max, round = false) {
  const rand = Math.random() * (max - min) + min
  return round ? Math.floor(rand) : rand
}

export const isCollide = (bounds1, bounds2) =>
  bounds1.xMin <= bounds2.xMax && bounds1.xMax >= bounds2.xMin &&
  bounds1.yMin <= bounds2.yMax && bounds1.yMax >= bounds2.yMin &&
  bounds1.zMin <= bounds2.zMax && bounds1.zMax >= bounds2.zMin

export function getHighPoint(geometry, face) {
  const v1 = geometry.vertices[face.a].y
  const v2 = geometry.vertices[face.b].y
  const v3 = geometry.vertices[face.c].y
  return Math.max(v1, v2, v3)
}

export function cameraFollowObject(camera, obj, { distance = 100, alpha = 0.05, y = 0 } = {}) {
  if (!obj) return
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(obj.quaternion)
  const newPosition = obj.position.clone()
  newPosition.sub(direction.multiplyScalar(distance))
  // camera height
  newPosition.y = obj.position.y + y
  camera.position.lerp(newPosition, alpha)
  camera.lookAt(obj.position)
}

/*
 * param: js hex color
 * return: THREE.Color()
*/
export function similarColor(color) {
  const factor = randomInRange(-0.25, 0.25)
  const hsl = {}
  const { h, s, l } = new THREE.Color(color).getHSL(hsl)
  const newCol = new THREE.Color().setHSL(h + h * factor, s, l + l * factor / 4)
  return newCol
}

export const randomColor = (h = .25, s = 0.5, l = 0.2) =>
  new THREE.Color().setHSL(Math.random() * 0.1 + h, s, Math.random() * 0.25 + l)
