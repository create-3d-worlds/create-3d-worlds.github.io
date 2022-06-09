import * as THREE from '/node_modules/three127/build/three.module.js'
import { SimplexNoise } from '/libs/SimplexNoise.js'
import { getTexture, randomNuance } from '/utils/helpers.js'

const noise = new SimplexNoise()

// ima neka bizarna razlika između createHillyTerrain i createHillyTerrain2, ujednačiti
export const createHillyTerrain = (
  { size = 400, segments = 20, color = 0x33aa33, factorX = size / 20, factorZ = size / 40, factorY = size / 10, file } = {}
) => {
  const material = new THREE.MeshLambertMaterial({
    color: !file ? color : null,
    vertexColors: THREE.FaceColors,
    map: file ? getTexture({ file, repeat: 16 }) : null
  })

  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(-Math.PI / 2)

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    const dist = noise.noise(vertex.x / segments / factorX, vertex.z / segments / factorZ)
    vertex.y = (dist - 0.2) * factorY
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  const colors = []
  for (let i = 0, l = position.count; i < l; i ++) {
    const nuance = randomNuance(color)
    colors.push(nuance.r, nuance.g, nuance.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  mesh.position.y = factorY * .75
  return mesh
}
