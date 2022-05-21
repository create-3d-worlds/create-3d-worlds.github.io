import * as THREE from '/node_modules/three119/build/three.module.js'
import { randomInRange, randomNuance, getTexture } from '/utils/helpers.js'

export function createGround({ size = 1000, color = 0x509f53, circle = true, file } = {}) {
  const params = { side: THREE.DoubleSide }
  const material = file
    ? new THREE.MeshBasicMaterial({ ...params, map: getTexture({ file, repeat: size / 10 }) })
    : new THREE.MeshPhongMaterial({ ...params, color }) // MeshLambertMaterial ne radi rasveta

  const geometry = circle
    ? new THREE.CircleGeometry(size, 32)
    : new THREE.PlaneGeometry(size, size)

  geometry.rotateX(-Math.PI * 0.5)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

export function createTerrain({ size = 400, segments = 50, colorParam, factor = 2 } = {}) {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(- Math.PI / 2)
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-factor, factor)
    // vertex.y += randomInRange(-factor * .5, factor * 1.5)
    vertex.y += randomInRange(-factor * 5, factor * 7.5) * Math.random() * Math.random() // 
    vertex.z += randomInRange(-factor, factor)
  })
  geometry.faces.forEach(face => {
    face.vertexColors.push(randomNuance(colorParam), randomNuance(colorParam), randomNuance(colorParam))
  })
  const material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

export function createWater({ size = 1000, opacity = 0.75, file } = {}) {
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1)
  geometry.rotateX(-Math.PI / 2)
  const material = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity
  })
  if (file)
    material.map = getTexture({ file, repeat: 5 })
  else
    material.color.setHex(0x6699ff)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

export function createFloor(params) {
  return createGround({ color: 0x808080, ...params })
}
