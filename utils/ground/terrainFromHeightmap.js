import * as THREE from '/node_modules/three127/build/three.module.js'

const textureLoader = new THREE.TextureLoader()

function terrainFromHeightmap({
  file = 'wiki.png', textureFile = '', widthSegments = 100, heightSegments = 100, displacementScale = 150
} = {}) {
  const geometry = new THREE.PlaneBufferGeometry(1000, 1000, widthSegments, heightSegments)

  const material = new THREE.MeshStandardMaterial({
    color: 0x666666,
    map: textureFile ? textureLoader.load(`/assets/textures/${textureFile}`) : null,
    displacementMap: textureLoader.load(`/assets/heightmaps/${file}`),
    displacementScale,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -.5
  return mesh
}

export default terrainFromHeightmap