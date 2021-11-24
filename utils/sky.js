import * as THREE from '/node_modules/three108/build/three.module.js'

export function createBlueSky({ radius = 4000 } = {}) {
  const vertexShader = `
  varying vec3 vWorldPosition;
  
  void main() {
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`

  const fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;
  
  varying vec3 vWorldPosition;
  
  void main() {
    float h = normalize( vWorldPosition + offset ).y;
    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
  }`

  const uniforms = {
    'topColor': { value: new THREE.Color(0x0077ff) },
    'bottomColor': { value: new THREE.Color(0xffffff) },
    'offset': { value: 33 },
    'exponent': { value: 0.6 }
  }
  const skyGeo = new THREE.SphereGeometry(radius, 32, 15)
  const skyMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.BackSide
  })
  return new THREE.Mesh(skyGeo, skyMat)
}

export function createSunLight({ d = 500 } = {}) {
  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.color.setHSL(0.1, 1, 0.95)
  dirLight.position.set(- 10, 17.5, 10)
  dirLight.position.multiplyScalar(30)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048
  // dužina bacanja senke
  dirLight.shadow.camera.left = - d
  dirLight.shadow.camera.right = d
  dirLight.shadow.camera.top = d
  dirLight.shadow.camera.bottom = - d
  dirLight.shadow.camera.far = 3500
  dirLight.shadow.bias = - 0.0001
  return dirLight
}
