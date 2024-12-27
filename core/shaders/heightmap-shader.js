import * as THREE from 'three'

const vertexShader = /* glsl */`
	uniform sampler2D heightmap;
	uniform float displacementScale;

	varying float vAmount;
	varying vec2 vUV;

	void main() 
	{ 
		vUV = uv;
		vec4 bumpData = texture2D(heightmap, uv);
		vAmount = bumpData.r; // map is grayscale so r, g, or b is the same.
		
		// move the position along the normal
		vec3 newPosition = position + normal * displacementScale * vAmount;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
	}
`

const fragmentShader = /* glsl */`
  uniform sampler2D heightmap;
  uniform float seaLevel;
  uniform bool snow;

	varying vec2 vUV;
	varying float vAmount;

  // color inspiration https://elevationmap.net/
  vec3 blue = vec3(0.592,0.824,0.89);
  vec3 green = vec3(0.29,0.651,0.239);
  vec3 yellow =  vec3(0.984,0.886,0.671);
  vec3 brown = vec3(0.498,0.18,0.024);
  vec3 white = vec3(1.,0.98,0.98);

  // https://gamedev.stackexchange.com/questions/86805
  vec3 color_from_height(const float height )
  {
      vec3 water = smoothstep(-0.1, seaLevel, vAmount) * blue;
      if (height < seaLevel) return water;

      float steps = snow ? 3.0 : 2.0;
      float hscaled = height * steps;
      int i = int(hscaled);
      float frac = hscaled - float(i);
      vec3 colors[4] = vec3[](green, yellow, brown, white);

      return mix(colors[i], colors[i+1], frac);
  }

	void main() 
	{
    vec3 color = color_from_height(vAmount);

    gl_FragColor = vec4(color, 1.0);
	}
`

const uniforms = {
  snow: { type: 'f', value: true },
  seaLevel: { type: 'f', value: 0.05 },
  heightmap: { type: 't', value: null },
  displacementScale: { type: 'f', value: 1.0 },
}

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})