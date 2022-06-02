import * as THREE from '/node_modules/three127/build/three.module.js'

const waves = []

export function createGround({ radius = 3000 } = {}) {
  const geometry = new THREE.CylinderGeometry(radius, radius, 4000, 200, 50)
  geometry.applyMatrix4(
    new THREE.Matrix4().makeRotationX(Math.PI * .5).makeRotationZ(Math.PI * .5)
  )

  const material = new THREE.MeshPhongMaterial({
    color: 0x91A566,
    transparent: true,
    opacity: .8,
    flatShading: true,
  })

  const ground = new THREE.Mesh(geometry, material)
  ground.receiveShadow = true
  ground.position.y = -radius

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    waves.push({
      y: vertex.y,
      x: vertex.x,
      z: vertex.z,
      ang: Math.random() * Math.PI * 2,
      amp: 5 + Math.random() * 15,
      speed: 0.016 + Math.random() * 0.032
    })
  }
  return ground
}

export function rotateGround(ground) {
  const { position } = ground.geometry.attributes
  const vertex = new THREE.Vector3()
  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    const wave = waves[i]
    vertex.z = wave.z + Math.cos(wave.ang) * wave.amp
    vertex.y = wave.y + Math.sin(wave.ang) * wave.amp
    wave.ang += wave.speed
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }
  ground.rotation.x -= .005
}