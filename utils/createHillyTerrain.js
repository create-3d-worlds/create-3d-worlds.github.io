import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from './helpers.js'
import { SimplexNoise } from '/libs/SimplexNoise.js'

export const createHillyTerrain = (
  { size = 1000, y = 30, color = 0x33aa33, factorX = 50, factorZ = 25, factorY = 60 } = {}
) => {
  const resolution = size / 50
  const material = new THREE.MeshLambertMaterial({
    color,
    vertexColors: THREE.FaceColors,
  })
  const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution)
  geometry.rotateX(-Math.PI / 2)

  const noise = new SimplexNoise()
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-factorX, factorX)
    vertex.z += randomInRange(-factorZ, factorZ)
    const dist = noise.noise(vertex.x / resolution / factorX, vertex.z / resolution / factorZ)
    vertex.y = (dist - 0.2) * factorY
  })
  geometry.faces.forEach(face => {
    const { color } = face
    const rand = Math.random() / 5
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = y
  return mesh
}
