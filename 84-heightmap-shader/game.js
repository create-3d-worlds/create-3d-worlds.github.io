import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import {loader, createWater} from '../utils/three-helpers.js'

createOrbitControls()

const bumpTexture = loader.load('../assets/heightmaps/stemkoski.png')
const oceanTexture = loader.load('../assets/textures/dirt-512.jpg')
const sandyTexture = loader.load('../assets/textures/sand-512.jpg')
const grassTexture = loader.load('../assets/textures/grass-512.jpg')
const rockyTexture = loader.load('../assets/textures/rock-512.jpg')
const snowyTexture = loader.load('../assets/textures/snow-512.jpg')

oceanTexture.wrapS = oceanTexture.wrapT = sandyTexture.wrapS = sandyTexture.wrapT = grassTexture.wrapS = grassTexture.wrapT = rockyTexture.wrapS = rockyTexture.wrapT = snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping

const uniforms = {
  bumpTexture: { type: 't', value: bumpTexture },
  bumpScale: { type: 'f', value: 300.0 },
  oceanTexture: { type: 't', value: oceanTexture },
  sandyTexture: { type: 't', value: sandyTexture },
  grassTexture: { type: 't', value: grassTexture },
  rockyTexture: { type: 't', value: rockyTexture },
  snowyTexture: { type: 't', value: snowyTexture },
}

const material = new THREE.ShaderMaterial(
  {
    uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
  })

const geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
geometry.rotateX(-Math.PI / 2)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y = -60
scene.add(mesh)

scene.add(createWater(1000, true, 0.60))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
