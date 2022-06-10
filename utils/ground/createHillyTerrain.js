import * as THREE from '/node_modules/three127/build/three.module.js'
import { SimplexNoise } from '/libs/SimplexNoise.js'
import { getTexture } from '/utils/helpers.js'
import { createWater } from '/utils/ground.js'
import chroma from '/libs/chroma.js'

const noise = new SimplexNoise()
const greens = ['#A62A2A', '#7a8a46', '#967848', '#ffffff']
// const greens = [0xA0522D, 0x2d4c1e, 0x228b22, 0x33aa33]

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
  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i)
    const dist = noise.noise(vertex.x / segments / factorX, vertex.z / segments / factorZ)
    vertex.y = factorY * (dist + .5) // + % above sea level
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  const colors = []
  const f = chroma.scale(greens).domain([-factorY * .1, factorY * 1.25])

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i)
    const nuance = new THREE.Color(f(vertex.y).hex())
    colors.push(nuance.r, nuance.g, nuance.b)
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  mesh.geometry.applyMatrix4(mesh.matrix)
  mesh.name = 'terrain'
  return mesh
}

export function createEnvironment({ size = 1200, segments = 20 } = {}) {
  const terrain = createHillyTerrain({ size, segments })
  const group = new THREE.Object3D()
  group.add(terrain)
  group.add(createWater({ size, segments }))
  group.receiveShadow = true
  return group
}