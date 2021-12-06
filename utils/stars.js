import * as THREE from '/node_modules/three108/build/three.module.js'

export function createStars({ radiusMin = 500, radius = 2000, numberOfStars = 10000 } = {}) {
  const geometry = new THREE.Geometry()

  for (let i = 0; i < numberOfStars; i++) {
    const direction = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
    const distance = Math.random() * radius + radiusMin
    const position = direction.multiplyScalar(distance)
    geometry.vertices.push(position)
  }

  const material = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    transparent: true,
    map: new THREE.TextureLoader().load('star.png')
  })

  return new THREE.Points(geometry, material)
}