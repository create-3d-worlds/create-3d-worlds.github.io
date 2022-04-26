import * as THREE from '/node_modules/three108/build/three.module.js'

function blowUpTree(vertices, sides, currentTier, rand) {
  let vertexIndex
  let vertexVector = new THREE.Vector3()
  const midPointVector = vertices[0].clone()
  let offset
  for (let i = 0; i < sides; i++) {
    vertexIndex = (currentTier * sides) + 1
    vertexVector = vertices[i + vertexIndex].clone()
    midPointVector.y = vertexVector.y
    offset = vertexVector.sub(midPointVector)
    if (i % 2 === 0) {
      offset.normalize().multiplyScalar(rand / 6)
      vertices[i + vertexIndex].add(offset)
    } else {
      offset.normalize().multiplyScalar(rand)
      vertices[i + vertexIndex].add(offset)
      vertices[i + vertexIndex].y = vertices[i + vertexIndex + sides].y + 0.05
    }
  }
}

function tightenTree(vertices, sides, currentTier) {
  let vertexIndex
  let vertexVector = new THREE.Vector3()
  const midPointVector = vertices[0].clone()
  let offset
  for (let i = 0; i < sides; i++) {
    vertexIndex = (currentTier * sides) + 1
    vertexVector = vertices[i + vertexIndex].clone()
    midPointVector.y = vertexVector.y
    offset = vertexVector.sub(midPointVector)
    offset.normalize().multiplyScalar(0.06)
    vertices[i + vertexIndex].sub(offset)
  }
}

function createTreeTop() {
  const sides = 8
  const tiers = 6
  const rand = (Math.random() * (0.25 - 0.1)) + 0.05
  const geometry = new THREE.ConeGeometry(0.5, 1, sides, tiers)
  const material = new THREE.MeshStandardMaterial({
    color: 0x33ff33,
    flatShading: true
  })
  blowUpTree(geometry.vertices, sides, 0, rand)
  tightenTree(geometry.vertices, sides, 1)
  blowUpTree(geometry.vertices, sides, 2, rand * 1.1)
  tightenTree(geometry.vertices, sides, 3)
  blowUpTree(geometry.vertices, sides, 4, rand * 1.2)
  tightenTree(geometry.vertices, sides, 5)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = false
  mesh.position.y = 0.9
  mesh.rotation.y = (Math.random() * (Math.PI))
  return mesh
}

function createTreeTrunk() {
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5)
  const material = new THREE.MeshStandardMaterial({
    color: 0x886633,
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 0.25
  return mesh
}

export function createTree() {
  const mesh = new THREE.Object3D()
  mesh.add(createTreeTrunk())
  mesh.add(createTreeTop())
  return mesh
}
