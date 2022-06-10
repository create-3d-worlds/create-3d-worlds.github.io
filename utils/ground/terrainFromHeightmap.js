import * as THREE from '/node_modules/three127/build/three.module.js'

const textureLoader = new THREE.TextureLoader()

// TODO: možda izbaciti async
function terrainFromHeightmap({
  file = 'wiki.png', textureFile = '', widthSegments = 100, heightSegments = 100, displacementScale = 150, color = 0x33aa33,
} = {}) {
  const displacementMap = textureLoader.load(`/assets/heightmaps/${file}`)

  const geometry = new THREE.PlaneBufferGeometry(1000, 1000, widthSegments, heightSegments)

  // const colors = []
  // for (let i = 0, l = geometry.attributes.position.count; i < l; i ++) {
  //   const nuance = similarColor(color)
  //   colors.push(nuance.r, nuance.g, nuance.b)
  // }
  // geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.MeshStandardMaterial({
    color: 'gray',
    // vertexColors: THREE.FaceColors,
    map: textureFile ? textureLoader.load(`/assets/textures/${textureFile}`) : null,
    displacementMap,
    displacementScale,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -.5
  return mesh
}

export default terrainFromHeightmap