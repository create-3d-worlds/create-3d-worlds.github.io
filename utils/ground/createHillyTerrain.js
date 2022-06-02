import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomInRange } from '../helpers.js'
import { SimplexNoise } from '/libs/SimplexNoise.js'
import { getTexture, randomNuance } from '/utils/helpers.js'

const noise = new SimplexNoise()

// { size = 1000, y = 30, factorX = 50, factorZ = 25, factorY = 60 }
export const createHillyTerrain = ({ size = 400, y = 30, color = 0x33aa33, factorX = size / 20, factorZ = size / 40, factorY = size / 10, file = 'grasslight-big.jpg' } = {}
) => {
  const resolution = size / 20
  const material = new THREE.MeshLambertMaterial({
    color,
    vertexColors: THREE.FaceColors,
    map: file ? getTexture({ file, repeat: 16 }) : null
  })

  const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution)
  geometry.rotateX(-Math.PI / 2)

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    vertex.x += randomInRange(-factorX, factorX)
    vertex.z += randomInRange(-factorZ, factorZ)
    const dist = noise.noise(vertex.x / resolution / factorX, vertex.z / resolution / factorZ)
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
  // mesh.castShadow = true
  mesh.position.y = y
  return mesh
}
