// https://codepen.io/AixDen/pen/mdVXeaP
import * as THREE from 'three'

const loader = new THREE.TextureLoader()

const texture = loader.load('/assets/images/noise.png')
texture.wrapS = texture.wrapT = THREE.RepeatWrapping

const vertexShader = /* glsl */`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

const fragmentShader = /* glsl */`
  varying vec2 vUv;
	uniform float u_time;

	float julia(vec2 z, vec2 c) {
		for(float i = 0.0; i < 1e2; i++) {
			float xx = z.x*z.x, yy = z.y*z.y, zz = xx + yy;
			if (zz > 10.0){return 100.0;}
			float re = c.x*z.x + c.y*z.y + xx*xx - yy*yy ;
			float im = c.y*z.x - c.x*z.y + 2.0*z.x*z.y*zz ;
			z = vec2(re, im)/zz;
		}
		return 0.0 ;
	}

	void main() {
		float pi = 3.14159265359 ;
		float elevation = (vUv.y-0.5)*pi ;
		float azimuth = vUv.x*2.0*pi ;
		float Z = sin(elevation) ;
		float cosel = cos(elevation) ; 
		float X = cosel*cos(azimuth) ;
		float Y = cosel*sin(azimuth) ;
		vec2 coord = vec2(X/(1.-Z),Y/(1.-Z)) ;

		coord = sqrt(0.1)*coord ;
		vec2 c = vec2(-0.01, -0.1) ;
		float cycle = mod(u_time/1000.,2.*pi) ;
		c = c + vec2(cos(cycle),sin(cycle))*.01 ;
		float m = julia(coord, c);
		vec3 rgb = 0.5 + 0.5 * cos(3.0 + 0.15 * m + vec3(0.0, 0.6, 2.));

		gl_FragColor = vec4(rgb, 1.0);
	}
`

export const uniforms = {
  u_time: { type: 'f', value: 1.0 },
}

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})