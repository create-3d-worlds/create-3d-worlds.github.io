import {randomInRange} from './helpers.js'
import {SimplexNoise} from '../libs/SimplexNoise.js'

export const createHillyTerrain = (size = 1000, y = 30) => {
  const resolution = 20
  const material = new THREE.MeshLambertMaterial({
    color: 0x33aa33,
    vertexColors: THREE.FaceColors,
  })
  const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution)
  geometry.rotateX(-Math.PI / 2)

  const noise = new SimplexNoise()
  const factorX = 50
  const factorZ = 25
  const factorY = 60
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
