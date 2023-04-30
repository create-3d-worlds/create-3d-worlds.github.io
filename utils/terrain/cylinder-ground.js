import * as THREE from 'three'

const deform = mesh => {
  const vertex = new THREE.Vector3()
  const { position } = mesh.geometry.attributes

  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    const angle = Math.random() * Math.PI * 2
    const amp = 4 + Math.random() * 12
    vertex.z += Math.cos(angle) * amp
    vertex.y += Math.sin(angle) * amp
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }
}

export function createGround(r = 2000, height = 2000, color = 0x91A566) {
  const geometry = new THREE.CylinderGeometry(r, r, height, 200, 50)
  const matrix = new THREE.Matrix4().makeRotationX(Math.PI * .5).makeRotationZ(Math.PI * .5)
  geometry.applyMatrix4(matrix)

  const material = new THREE.MeshPhongMaterial({
    color,
    opacity: .8,
    transparent: true,
    flatShading: true,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  mesh.position.y = -r
  deform(mesh)
  return mesh
}
