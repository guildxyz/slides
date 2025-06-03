import { useEffect, useRef } from 'react'

const ShaderBackground = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl')
    
    if (!gl) {
      console.warn('WebGL not supported')
      return
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      float smoothNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(mix(noise(i + vec2(0.0,0.0)), 
                      noise(i + vec2(1.0,0.0)), u.x),
                  mix(noise(i + vec2(0.0,1.0)), 
                      noise(i + vec2(1.0,1.0)), u.x), u.y);
      }
      
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        
        for (int i = 0; i < 6; i++) {
          value += amplitude * smoothNoise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;
        
        float time = u_time * 0.2;
        
        vec2 pos = st * 4.0;
        
        float layer1 = fbm(pos + vec2(sin(time * 0.8) * 0.8, cos(time * 0.6) * 0.6));
        float layer2 = fbm(pos * 2.0 + vec2(cos(time * 0.9) * 1.0, sin(time * 0.7) * 0.8));
        float layer3 = fbm(pos * 0.5 + vec2(sin(time * 0.5) * 1.2, cos(time * 0.8) * 1.0));
        
        float combined = layer1 * 0.6 + layer2 * 0.4 + layer3 * 0.3;
        
        float energyWaves = sin(st.x * 12.0 + time * 2.0) * sin(st.y * 10.0 + time * 1.8) * 0.15;
        combined += energyWaves;
        
        vec2 center = vec2(0.5);
        float dist = length(st - center);
        float pulseRipple = sin(dist * 20.0 - time * 3.0) * exp(-dist * 3.0) * 0.2;
        combined += pulseRipple;
        
        float spiralEffect = atan(st.y - 0.5, st.x - 0.5) + time * 1.0;
        float spiral = sin(spiralEffect * 3.0 + dist * 15.0) * 0.1;
        combined += spiral;
        
        float streaks = sin((st.x + st.y) * 8.0 + time * 2.5) * 0.08;
        combined += streaks;
        
        float burstEffect = sin(time * 1.5) * 0.1 + 1.0;
        combined *= burstEffect;
        
        float rainbowHue = mod(combined * 1.5 + time * 0.15 + dist * 2.0, 1.0);
        
        float dynamicSaturation = 0.7 + sin(combined * 8.0 + time * 1.0) * 0.25;
        dynamicSaturation = clamp(dynamicSaturation, 0.5, 1.0);
        
        float dynamicBrightness = 0.4 + combined * 0.5 + sin(time * 0.8) * 0.15;
        dynamicBrightness = clamp(dynamicBrightness, 0.3, 0.8);
        
        vec3 color = hsv2rgb(vec3(rainbowHue, dynamicSaturation, dynamicBrightness));
        
        float highlight = smoothstep(0.7, 1.0, combined) * 0.3;
        color += vec3(highlight);
        
        float alpha = 0.7 + sin(combined * 10.0 + time * 1.0) * 0.2;
        alpha = clamp(alpha, 0.5, 0.9);
        
        gl_FragColor = vec4(color, alpha * 0.6);
      }
    `

    const createShader = (source, type) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      
      return shader
    }

    const vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER)

    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const render = (time) => {
      gl.clearColor(0.0, 0.0, 0.0, 0.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      gl.useProgram(program)
      
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1f(timeLocation, time * 0.001)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      
      animationRef.current = requestAnimationFrame(render)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animationRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="shader-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  )
}

export default ShaderBackground 