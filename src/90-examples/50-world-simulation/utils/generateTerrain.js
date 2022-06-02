import * as THREE from '/node_modules/three125/build/three.module.js'
import { randomNuance } from '/utils/helpers.js'
import SimplexNoise from '../libs/SimplexNoise.js'

export function generateTerrain({ groundColor = 0x33aa33, waterColor = 0x6699ff } = {}) {
  const resolution = 20
  const material = new THREE.MeshLambertMaterial({
    color: groundColor,
    vertexColors: THREE.FaceColors
  })
  const geometry = new THREE.PlaneGeometry(1200, 1200, resolution, resolution)
  geometry.dynamic = true
  geometry.verticesNeedUpdate = true

  const noise = new SimplexNoise()
  let n

  const factorX = 50
  const factorY = 25
  const factorZ = 60

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    n = noise.noise(vertex.x / resolution / factorX, vertex.y / resolution / factorY)
    n -= 0.25
    vertex.z = n * factorZ
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  const groundColors = []
  for (let i = 0, l = position.count; i < l; i ++) {
    const color = randomNuance(groundColor)
    groundColors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(groundColors, 3))

  const land = new THREE.Mesh(geometry, material)
  land.receiveShadow = true
  land.name = 'land'
  land.rotateX(-Math.PI / 2)
  land.position.set(0, 30, 0)

  const water_material = new THREE.MeshLambertMaterial({ color: waterColor, opacity: 0.75, vertexColors: THREE.FaceColors })
  const water_geometry = new THREE.PlaneGeometry(1200, 1200, resolution, resolution)
  water_geometry.dynamic = true
  water_geometry.verticesNeedUpdate = true

  const waterColors = []
  for (let i = 0, l = water_geometry.attributes.position.count; i < l; i ++) {
    const color = randomNuance(waterColor)
    waterColors.push(color.r, color.g, color.b)
  }
  water_geometry.setAttribute('color', new THREE.Float32BufferAttribute(waterColors, 3))

  const water = new THREE.Mesh(water_geometry, water_material)
  water.receiveShadow = true
  water.name = 'water'
  water.rotateX(-Math.PI / 2)

  const terrain = new THREE.Object3D()
  terrain.name = 'terrain'
  terrain.add(land)
  terrain.add(water)
  terrain.receiveShadow = true
  return terrain
}