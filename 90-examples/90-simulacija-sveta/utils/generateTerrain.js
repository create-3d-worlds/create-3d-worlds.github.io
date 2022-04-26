import * as THREE from '/node_modules/three108/build/three.module.js'
import SimplexNoise from '../libs/SimplexNoise.js'

export function generateTerrain() {
  const resolution = 20
  const material = new THREE.MeshLambertMaterial({
    color: 0x33aa33,
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

  for (let i = 0; i < geometry.vertices.length; i++) {
    n = noise.noise(geometry.vertices[i].x / resolution / factorX, geometry.vertices[i].y / resolution / factorY)
    n -= 0.25
    geometry.vertices[i].z = n * factorZ
  }

  for (let f = 0; f < geometry.faces.length; f++) {
    const { color } = geometry.faces[f]
    const rand = Math.random() / 5
    geometry.faces[f].color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  }

  const land = new THREE.Mesh(geometry, material)
  land.receiveShadow = true
  land.name = 'land'
  land.rotateX(-Math.PI / 2)
  land.position.set(0, 30, 0)

  const water_material = new THREE.MeshLambertMaterial({ color: 0x6699ff, transparent: true, opacity: 0.75, vertexColors: THREE.FaceColors })
  const water_geometry = new THREE.PlaneGeometry(1200, 1200, resolution, resolution)
  water_geometry.dynamic = true
  water_geometry.verticesNeedUpdate = true
  for (let i = 0; i < water_geometry.faces.length; i++) {
    const { color } = water_geometry.faces[i]
    const rand = Math.random()
    water_geometry.faces[i].color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  }

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