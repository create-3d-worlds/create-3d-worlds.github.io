import { scene, renderer, camera, createOrbitControls } from '../utils/three-scene.js'

const loader = new THREE.TextureLoader()
createOrbitControls()

const bumpTexture = loader.load('../assets/heightmaps/stemkoski.png')
const oceanTexture = loader.load('../assets/textures/dirt-512.jpg')
const sandyTexture = loader.load('../assets/textures/sand-512.jpg')
const grassTexture = loader.load('../assets/textures/grass-512.jpg')
const rockyTexture = loader.load('../assets/textures/rock-512.jpg')
const snowyTexture = loader.load('../assets/textures/snow-512.jpg')

oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping
sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping
snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping

const customUniforms = {
  bumpTexture: { type: 't', value: bumpTexture },
  bumpScale: { type: 'f', value: 300.0 },
  oceanTexture: { type: 't', value: oceanTexture },
  sandyTexture: { type: 't', value: sandyTexture },
  grassTexture: { type: 't', value: grassTexture },
  rockyTexture: { type: 't', value: rockyTexture },
  snowyTexture: { type: 't', value: snowyTexture },
}

const customMaterial = new THREE.ShaderMaterial(
  {
    uniforms: customUniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
  })

const planeGeo = new THREE.PlaneGeometry(1000, 1000, 100, 100)
const plane = new THREE.Mesh(planeGeo, customMaterial)
plane.rotation.x = -Math.PI / 2
plane.position.y = -60
scene.add(plane)

function createWater(size = 1000, useTexture = false) {
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1)
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.40
  })

  if (useTexture) {
    const texture = loader.load('../assets/textures/water512.jpg')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 5)
    material.map = texture
  } else
    material.color.setHex(0x6699ff)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = 0
  return mesh
}

scene.add(createWater(1000, true))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
