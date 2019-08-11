import { NormalMapShader } from '../../node_modules/three/examples/jsm/shaders/NormalMapShader.js'
import { TerrainShader } from '../../node_modules/three/examples/jsm/shaders/TerrainShader.js'
import { BufferGeometryUtils } from '../../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js'
import { scene, camera, renderer, clock, createOrbitControls } from '../utils/three-scene.js'

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

const lightVal = 0.8
const mlib = {}

const sceneRenderTarget = new THREE.Scene()

const cameraOrtho = new THREE.OrthographicCamera(SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, - 10000, 10000)
cameraOrtho.position.z = 100

sceneRenderTarget.add(cameraOrtho)

camera.position.set(- 1200, 800, 1200)

scene.background = new THREE.Color(0x050505)
scene.fog = new THREE.Fog(0x050505, 2000, 4000)

scene.add(new THREE.AmbientLight(0x111111))

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
directionalLight.position.set(500, 2000, 0)
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xff4400, 1.5)
pointLight.position.set(0, 0, 0)
scene.add(pointLight)

const rx = 256, ry = 256
const pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat }

const heightMap = new THREE.WebGLRenderTarget(rx, ry, pars)
heightMap.texture.generateMipmaps = false

const normalMap = new THREE.WebGLRenderTarget(rx, ry, pars)
normalMap.texture.generateMipmaps = false

const uniformsNoise = {
  'time': { value: 1.0 },
  'scale': { value: new THREE.Vector2(1.5, 1.5) },
  'offset': { value: new THREE.Vector2(0, 0) }
}

const uniformsNormal = THREE.UniformsUtils.clone(NormalMapShader.uniforms)
uniformsNormal.height.value = 0.05
uniformsNormal.resolution.value.set(rx, ry)
uniformsNormal.heightMap.value = heightMap.texture

const vertexShader = document.getElementById('vertexShader').textContent

// TEXTURES

const loadingManager = new THREE.LoadingManager((() => console.log('all loaded')))
const textureLoader = new THREE.TextureLoader(loadingManager)

const specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars)
specularMap.texture.generateMipmaps = false

const diffuseTexture1 = textureLoader.load('../assets/textures/grasslight-big.jpg')
const diffuseTexture2 = textureLoader.load('../assets/textures/backgrounddetailed6.jpg')
const detailTexture = textureLoader.load('../assets/textures/grasslight-big-nm.jpg')

diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping
diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping
detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping
specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping

// TERRAIN SHADER

const uniformsTerrain = THREE.UniformsUtils.clone(TerrainShader.uniforms)

uniformsTerrain.tNormal.value = normalMap.texture
uniformsTerrain.tDisplacement.value = heightMap.texture

uniformsTerrain.tDiffuse1.value = diffuseTexture1
uniformsTerrain.tDiffuse2.value = diffuseTexture2
uniformsTerrain.tDetail.value = detailTexture

uniformsTerrain.enableDiffuse1.value = true
uniformsTerrain.enableDiffuse2.value = true

uniformsTerrain.uDisplacementScale.value = 375
uniformsTerrain.uRepeatOverlay.value.set(6, 6)

const params = [
  ['heightmap', document.getElementById('fragmentShaderNoise').textContent, vertexShader, uniformsNoise, false],
  ['normal', NormalMapShader.fragmentShader, NormalMapShader.vertexShader, uniformsNormal, false],
  ['terrain', TerrainShader.fragmentShader, TerrainShader.vertexShader, uniformsTerrain, true]
]

for (let i = 0; i < params.length; i++) {
  const material = new THREE.ShaderMaterial({
    uniforms: params[i][3],
    vertexShader: params[i][2],
    fragmentShader: params[i][1],
    lights: params[i][4],
    fog: true
  })
  mlib[params[i][0]] = material
}

const plane = new THREE.PlaneBufferGeometry(SCREEN_WIDTH, SCREEN_HEIGHT)

const quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x000000 }))
quadTarget.position.z = - 500
sceneRenderTarget.add(quadTarget)

// TERRAIN MESH

const geometryTerrain = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256)

BufferGeometryUtils.computeTangents(geometryTerrain)

const terrain = new THREE.Mesh(geometryTerrain, mlib.terrain)
terrain.position.set(0, - 125, 0)
terrain.rotation.x = - Math.PI / 2
scene.add(terrain)

scene.background.setHSL(0.1, 0.5, lightVal)
scene.fog.color.setHSL(0.1, 0.5, lightVal)

createOrbitControls()

function render() {
  const delta = clock.getDelta()
  uniformsNoise.offset.value.x += delta * 0.05
  uniformsTerrain.uOffset.value.x = 4 * uniformsNoise.offset.value.x

  quadTarget.material = mlib.heightmap
  renderer.setRenderTarget(heightMap)
  renderer.clear()
  renderer.render(sceneRenderTarget, cameraOrtho)

  quadTarget.material = mlib.normal
  renderer.setRenderTarget(normalMap)
  renderer.clear()
  renderer.render(sceneRenderTarget, cameraOrtho)
  renderer.setRenderTarget(null)
  renderer.render(scene, camera)
}

// INIT

void function animate() {
  requestAnimationFrame(animate)
  render()
}()
