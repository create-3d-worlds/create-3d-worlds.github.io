import { scene, renderer, camera, createOrbitControls } from '../utils/three-scene.js'

const bumpScale = 200.0

createOrbitControls()

const skyBoxGeometry = new THREE.CubeGeometry(20000, 20000, 10000)
const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide })
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial)
scene.add(skyBox)

const bumpTexture = new THREE.ImageUtils.loadTexture('../assets/heightmaps/heightmap.png')
bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping

const oceanTexture = new THREE.ImageUtils.loadTexture('../assets/textures/dirt-512.jpg')
oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping

const sandyTexture = new THREE.ImageUtils.loadTexture('../assets/textures/sand-512.jpg')
sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping

const grassTexture = new THREE.ImageUtils.loadTexture('../assets/textures/grass-512.jpg')
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping

const rockyTexture = new THREE.ImageUtils.loadTexture('../assets/textures/rock-512.jpg')
rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping

const snowyTexture = new THREE.ImageUtils.loadTexture('../assets/textures/snow-512.jpg')
snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping

const customUniforms = {
  bumpTexture: { type: 't', value: bumpTexture },
  bumpScale: { type: 'f', value: bumpScale },
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
plane.position.y = -100
scene.add(plane)

const waterTex = new THREE.ImageUtils.loadTexture('../assets/textures/water512.jpg')
waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping
waterTex.repeat.set(5, 5)
const waterMat = new THREE.MeshBasicMaterial({ map: waterTex, transparent: true, opacity: 0.40 })
const water = new THREE.Mesh(planeGeo, waterMat)
water.rotation.x = -Math.PI / 2
water.position.y = -50
scene.add(water)

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
