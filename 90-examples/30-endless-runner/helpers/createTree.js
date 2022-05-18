import * as THREE from '/node_modules/three108/build/three.module.js'

function distortFir(vertices, radialSegments, currSegment, factor) {
  let vertexIndex
  let vertexVector = new THREE.Vector3()
  const midPointVector = vertices[0].clone()
  let offset
  for (let i = 0; i < radialSegments; i++) {
    vertexIndex = currSegment * radialSegments + 1
    vertexVector = vertices[i + vertexIndex].clone()
    midPointVector.y = vertexVector.y
    offset = vertexVector.sub(midPointVector)
    if (i % 2 === 0) {
      offset.normalize().multiplyScalar(factor / 6)
      vertices[i + vertexIndex].add(offset)
    } else {
      offset.normalize().multiplyScalar(factor)
      vertices[i + vertexIndex].add(offset)
      vertices[i + vertexIndex].y = vertices[i + vertexIndex + radialSegments].y + 0.05
    }
  }
}

function tightenFir(vertices, radialSegments, currSegment) {
  let vertexIndex
  let vertexVector = new THREE.Vector3()
  const midPointVector = vertices[0].clone()
  let offset
  for (let i = 0; i < radialSegments; i++) {
    vertexIndex = currSegment * radialSegments + 1
    vertexVector = vertices[i + vertexIndex].clone()
    midPointVector.y = vertexVector.y
    offset = vertexVector.sub(midPointVector)
    offset.normalize().multiplyScalar(0.06)
    vertices[i + vertexIndex].sub(offset)
  }
}

function createFirTop({ radius = 0.5, height = 1, radialSegments = 8, heightSegments = 6 } = {}) {
  const rand = Math.random() * 0.15 + 0.05
  const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments)
  const material = new THREE.MeshStandardMaterial({
    color: 0x33ff33, // TODO: random green
    flatShading: true
  })

  distortFir(geometry.vertices, radialSegments, 0, rand)
  tightenFir(geometry.vertices, radialSegments, 1)
  distortFir(geometry.vertices, radialSegments, 2, rand * 1.1)
  tightenFir(geometry.vertices, radialSegments, 3)
  distortFir(geometry.vertices, radialSegments, 4, rand * 1.2)
  tightenFir(geometry.vertices, radialSegments, 5)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = mesh.receiveShadow = false
  mesh.position.y = 0.9
  mesh.rotation.y = (Math.random() * (Math.PI))
  return mesh
}

function createFirTrunk() {
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5)
  const material = new THREE.MeshStandardMaterial({
    color: 0x886633,
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 0.25
  return mesh
}

export function createFir() {
  const mesh = new THREE.Object3D()
  mesh.add(createFirTrunk())
  mesh.add(createFirTop())
  return mesh
}
