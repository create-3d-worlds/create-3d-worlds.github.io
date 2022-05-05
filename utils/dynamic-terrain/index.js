import * as THREE from '/node_modules/three108/build/three.module.js'
import { NormalMapShader } from '/node_modules/three108/examples/jsm/shaders/NormalMapShader.js'
import { TerrainShader } from '/node_modules/three108/examples/jsm/shaders/TerrainShader.js'
import { BufferGeometryUtils } from '/node_modules/three108/examples/jsm/utils/BufferGeometryUtils.js'

import { renderer } from '/utils/scene.js'
import fragmentShaderNoise from './fragmentShaderNoise.js'
import vertexShader from './vertexShader.js'

let animDelta = 0
const { innerWidth, innerHeight } = window
const mlib = {}

const cameraOrtho = new THREE.OrthographicCamera(innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / -2, -10000, 10000)
cameraOrtho.position.z = 100

// HEIGHT + NORMAL MAPS
const rx = 256, ry = 256
const pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat }
const heightMap = new THREE.WebGLRenderTarget(rx, ry, pars)
const normalMap = new THREE.WebGLRenderTarget(rx, ry, pars)
const uniformsNoise = {
  'time': { value: 1.0 },
  'scale': { value: new THREE.Vector2(1.5, 1.5) },
  'offset': { value: new THREE.Vector2(0, 0) }
}
const uniformsNormal = THREE.UniformsUtils.clone(NormalMapShader.uniforms)
uniformsNormal.height.value = 0.05
uniformsNormal.resolution.value.set(rx, ry)
uniformsNormal.heightMap.value = heightMap.texture

// TEXTURES
const loader = new THREE.TextureLoader()
const diffuseTexture1 = loader.load('/assets/textures/grasslight-big.jpg')
const diffuseTexture2 = loader.load('/assets/textures/backgrounddetailed6.jpg')
const detailTexture = loader.load('/assets/textures/grasslight-big-nm.jpg')
diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping
diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping
detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping

// TERRAIN SHADER
const uniformsTerrain = THREE.UniformsUtils.clone(TerrainShader.uniforms)
uniformsTerrain.tNormal.value = normalMap.texture
uniformsTerrain.uNormalScale.value = 3.5
uniformsTerrain.tDisplacement.value = heightMap.texture
uniformsTerrain.tDiffuse1.value = diffuseTexture1
uniformsTerrain.tDiffuse2.value = diffuseTexture2
uniformsTerrain.tDetail.value = detailTexture
uniformsTerrain.enableDiffuse1.value = true
uniformsTerrain.enableDiffuse2.value = true
uniformsTerrain.uDisplacementScale.value = 375
uniformsTerrain.uRepeatOverlay.value.set(6, 6)

const shaders = [
  ['heightmap', fragmentShaderNoise, vertexShader, uniformsNoise, false],
  ['normal', NormalMapShader.fragmentShader, NormalMapShader.vertexShader, uniformsNormal, false],
  ['terrain', TerrainShader.fragmentShader, TerrainShader.vertexShader, uniformsTerrain, true]
]
shaders.forEach(shader => {
  const material = new THREE.ShaderMaterial({
    fragmentShader: shader[1],
    vertexShader: shader[2],
    uniforms: shader[3],
    lights: shader[4],
    fog: true
  })
  mlib[shader[0]] = material
})

const plane = new THREE.PlaneBufferGeometry(innerWidth, innerHeight)
const quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x000000 }))

// TERRAIN
const geometry = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256)
BufferGeometryUtils.computeTangents(geometry)
export const terrain = new THREE.Mesh(geometry, mlib.terrain)
terrain.position.set(0, -125, 0)
terrain.rotation.x = -Math.PI / 2

const sceneRenderTarget = new THREE.Scene()
sceneRenderTarget.add(quadTarget)

function renderTerrain() {
  quadTarget.material = mlib.heightmap
  renderer.setRenderTarget(heightMap)
  renderer.render(sceneRenderTarget, cameraOrtho)
  quadTarget.material = mlib.normal
  renderer.setRenderTarget(normalMap)
  renderer.render(sceneRenderTarget, cameraOrtho)
  renderer.setRenderTarget(null)
}

export function updateTerrain(x, y) {
  animDelta = THREE.Math.clamp(animDelta, 0, 0.05)
  uniformsNoise.time.value += animDelta
  uniformsNoise.offset.value.x += x * 0.0005
  uniformsTerrain.uOffset.value.x = 4 * uniformsNoise.offset.value.x
  uniformsNoise.offset.value.y += y * 0.0005
  uniformsTerrain.uOffset.value.y = 4 * uniformsNoise.offset.value.y
  renderTerrain()
}
