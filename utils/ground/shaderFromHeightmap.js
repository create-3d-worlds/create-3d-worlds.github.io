import * as THREE from '/node_modules/three127/build/three.module.js'

const loader = new THREE.TextureLoader()

export default function(src) {
  const oceanTexture = loader.load('/assets/textures/dirt-512.jpg')
  const sandyTexture = loader.load('/assets/textures/sand-512.jpg')
  const grassTexture = loader.load('/assets/textures/grass-512.jpg')
  const rockyTexture = loader.load('/assets/textures/rock-512.jpg')
  const snowyTexture = loader.load('/assets/textures/snow-512.jpg')

  oceanTexture.wrapS = oceanTexture.wrapT = sandyTexture.wrapS = sandyTexture.wrapT = grassTexture.wrapS = grassTexture.wrapT = rockyTexture.wrapS = rockyTexture.wrapT = snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping

  const uniforms = {
    bumpTexture: { type: 't', value: loader.load(src) },
    bumpScale: { type: 'f', value: 300.0 },
    oceanTexture: { type: 't', value: oceanTexture },
    sandyTexture: { type: 't', value: sandyTexture },
    grassTexture: { type: 't', value: grassTexture },
    rockyTexture: { type: 't', value: rockyTexture },
    snowyTexture: { type: 't', value: snowyTexture },
  }

  const vertexShader = `
	uniform sampler2D bumpTexture;
	uniform float bumpScale;

	varying float vAmount;
	varying vec2 vUV;

	void main() 
	{ 
		vUV = uv;
		vec4 bumpData = texture2D( bumpTexture, uv );
		vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
		
		// move the position along the normal
		vec3 newPosition = position + normal * bumpScale * vAmount;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
	}
`

  const fragmentShader = `
	uniform sampler2D oceanTexture;
	uniform sampler2D sandyTexture;
	uniform sampler2D grassTexture;
	uniform sampler2D rockyTexture;
	uniform sampler2D snowyTexture;

	varying vec2 vUV;
	varying float vAmount;

	void main() 
	{
		vec4 water = (smoothstep(0.01, 0.25, vAmount) - smoothstep(0.24, 0.26, vAmount)) * texture2D( oceanTexture, vUV * 10.0 );
		vec4 sandy = (smoothstep(0.24, 0.27, vAmount) - smoothstep(0.28, 0.31, vAmount)) * texture2D( sandyTexture, vUV * 10.0 );
		vec4 grass = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( grassTexture, vUV * 20.0 );
		vec4 rocky = (smoothstep(0.30, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( rockyTexture, vUV * 20.0 );
		vec4 snowy = (smoothstep(0.50, 0.65, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass + rocky + snowy; //, 1.0);
	}
`

  const material = new THREE.ShaderMaterial(
    {
      uniforms,
      vertexShader,
      fragmentShader,
    })

  const geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
  geometry.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = -60
  return mesh
}
