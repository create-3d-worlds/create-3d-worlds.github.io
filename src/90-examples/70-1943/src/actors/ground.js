/* global THREE */

const waves = []
const radius = 3000

const geometry = new THREE.CylinderGeometry(
  radius, radius, 4000, 200, 50)
geometry.applyMatrix(
  new THREE.Matrix4()
  .makeRotationX(Math.PI / 2)
  .makeRotationZ(Math.PI * 0.5)
)
geometry.mergeVertices()

const material = new THREE.MeshPhongMaterial({
  color: 0x91A566,
  transparent: true,
  opacity: .8,
  flatShading: true,
})

const ground = new THREE.Mesh(geometry, material)
ground.receiveShadow = true
ground.position.y = -radius

geometry.vertices.map(vertex => {
  waves.push({
    y: vertex.y,
    x: vertex.x,
    z: vertex.z,
    ang: Math.random() * Math.PI * 2,
    amp: 5 + Math.random() * 15,
    speed: 0.016 + Math.random() * 0.032
  })
})

ground.rotate = function() {
  geometry.vertices.map((vertex, i) => {
    const wave = waves[i]
    vertex.z = wave.z + Math.cos(wave.ang) * wave.amp
    vertex.y = wave.y + Math.sin(wave.ang) * wave.amp
    wave.ang += wave.speed
  })
  geometry.verticesNeedUpdate = true
  ground.rotation.x -= .005
}

export default ground
