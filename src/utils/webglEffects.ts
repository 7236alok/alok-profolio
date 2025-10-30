// WebGL and shader-like effects for advanced visual experiences
export class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animationId: number = 0;
  private startTime: number = Date.now();

  // Vertex shader for basic geometry
  private vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;

  // Fragment shader for neural network visualization
  private fragmentShaderSource = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 v_texCoord;

    // Noise function for organic movement
    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // Smooth noise
    float smoothNoise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(
        mix(noise(i + vec2(0.0,0.0)), noise(i + vec2(1.0,0.0)), u.x),
        mix(noise(i + vec2(0.0,1.0)), noise(i + vec2(1.0,1.0)), u.x), 
        u.y
      );
    }

    // Neural network node visualization
    float neuralNode(vec2 st, vec2 center, float radius) {
      float dist = distance(st, center);
      float pulse = sin(u_time * 2.0 + dist * 10.0) * 0.5 + 0.5;
      return smoothstep(radius + 0.02, radius, dist) * pulse;
    }

    // Connection lines between nodes
    float connection(vec2 st, vec2 start, vec2 end, float width) {
      vec2 pa = st - start;
      vec2 ba = end - start;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      float dist = length(pa - ba * h);
      
      float pulse = sin(u_time * 3.0 + length(start - end) * 20.0) * 0.5 + 0.5;
      return smoothstep(width + 0.005, width, dist) * pulse * 0.6;
    }

    void main() {
      vec2 st = v_texCoord;
      vec2 mouse = u_mouse / u_resolution;
      
      // Background gradient
      vec3 color = vec3(0.05, 0.1, 0.2);
      
      // Add some movement based on time and mouse
      st += smoothNoise(st * 3.0 + u_time * 0.1) * 0.02;
      
      // Neural network nodes
      vec3 nodeColor = vec3(0.2, 0.6, 1.0);
      float nodes = 0.0;
      
      // Create a grid of neural nodes
      for(float i = 0.0; i < 5.0; i++) {
        for(float j = 0.0; j < 5.0; j++) {
          vec2 nodePos = vec2(i/4.0, j/4.0) + 0.1;
          nodePos += sin(u_time * 0.5 + i * j) * 0.05;
          
          // Mouse interaction
          float mouseDist = distance(mouse, nodePos);
          float influence = 1.0 - smoothstep(0.0, 0.3, mouseDist);
          
          nodes += neuralNode(st, nodePos, 0.02 + influence * 0.01);
        }
      }
      
      // Add connections between nearby nodes
      float connections = 0.0;
      vec2 node1 = vec2(0.2, 0.3) + sin(u_time * 0.3) * 0.1;
      vec2 node2 = vec2(0.8, 0.7) + cos(u_time * 0.4) * 0.1;
      vec2 node3 = vec2(0.6, 0.2) + sin(u_time * 0.5) * 0.1;
      
      connections += connection(st, node1, node2, 0.002);
      connections += connection(st, node2, node3, 0.002);
      connections += connection(st, node3, node1, 0.002);
      
      // Combine effects
      color += nodeColor * nodes;
      color += vec3(0.4, 0.8, 1.0) * connections;
      
      // Add some glow effect
      float glow = smoothNoise(st * 2.0 + u_time * 0.2) * 0.1;
      color += vec3(0.1, 0.2, 0.4) * glow;
      
      // Vignette effect
      float vignette = 1.0 - distance(st, vec2(0.5)) * 0.8;
      color *= vignette;
      
      gl_FragColor = vec4(color, 0.8);
    }
  `;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initWebGL();
  }

  private initWebGL(): boolean {
    this.gl = this.canvas.getContext('webgl') as WebGLRenderingContext || 
              this.canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    
    if (!this.gl) {
      console.warn('WebGL not supported, falling back to canvas 2D');
      return false;
    }

    // Create shader program
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return false;

    this.program = this.createProgram(vertexShader, fragmentShader);
    if (!this.program) return false;

    // Set up geometry
    this.setupGeometry();
    
    return true;
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    if (!this.gl) return null;

    const program = this.gl.createProgram();
    if (!program) return null;

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  private setupGeometry(): void {
    if (!this.gl || !this.program) return;

    // Create a quad that covers the entire screen
    const positions = new Float32Array([
      -1, -1,  0, 0,
       1, -1,  1, 0,
      -1,  1,  0, 1,
       1,  1,  1, 1,
    ]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');

    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.enableVertexAttribArray(texCoordLocation);

    // Position attribute
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);
    // Texture coordinate attribute
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
  }

  public render(mouseX: number = 0, mouseY: number = 0): void {
    if (!this.gl || !this.program) return;

    // Set viewport
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Clear
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Use our shader program
    this.gl.useProgram(this.program);

    // Set uniforms
    const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    const mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse');

    this.gl.uniform1f(timeLocation, (Date.now() - this.startTime) / 1000.0);
    this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(mouseLocation, mouseX, mouseY);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  public startAnimation(): void {
    const animate = () => {
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  public stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  public updateMouse(x: number, y: number): void {
    this.render(x, y);
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    if (this.gl) {
      this.gl.viewport(0, 0, width, height);
    }
  }

  public destroy(): void {
    this.stopAnimation();
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}

// CSS-based shader-like effects for fallback
export const cssShaderEffects = {
  neuralGradient: `
    background: linear-gradient(
      45deg,
      rgba(79, 70, 229, 0.3) 0%,
      rgba(59, 130, 246, 0.2) 25%,
      rgba(139, 92, 246, 0.3) 50%,
      rgba(236, 72, 153, 0.2) 75%,
      rgba(15, 23, 42, 0.9) 100%
    );
    background-size: 400% 400%;
    animation: gradientShift 8s ease infinite;
  `,

  holographicText: `
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
  `,

  quantumBlur: `
    filter: blur(0.5px) brightness(1.1) contrast(1.2);
    animation: quantumFlicker 2s infinite;
  `,

  matrixRain: `
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 255, 0, 0.1) 50%,
      transparent 100%
    );
    animation: matrixFall 3s linear infinite;
  `,
};

// CSS animations to accompany the effects
export const cssAnimations = `
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes quantumFlicker {
    0%, 100% { filter: blur(0.5px) brightness(1.1) contrast(1.2); }
    50% { filter: blur(1px) brightness(1.3) contrast(1.4); }
  }

  @keyframes matrixFall {
    0% { transform: translateY(-100vh); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes neuralPulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 1; }
  }

  @keyframes holographicGlow {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(79, 70, 229, 0.5),
                  0 0 40px rgba(59, 130, 246, 0.3),
                  0 0 60px rgba(139, 92, 246, 0.1);
    }
    50% { 
      box-shadow: 0 0 30px rgba(236, 72, 153, 0.6),
                  0 0 60px rgba(79, 70, 229, 0.4),
                  0 0 90px rgba(59, 130, 246, 0.2);
    }
  }
`;

// Performance-aware renderer that chooses the best approach
export class AdaptiveRenderer {
  private useWebGL: boolean = false;
  private webglRenderer: WebGLRenderer | null = null;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.detectCapabilities();
  }

  private detectCapabilities(): void {
    // Check for WebGL support
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    
    // Check performance
    const isHighPerformance = navigator.hardwareConcurrency >= 4;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.useWebGL = !!gl && isHighPerformance && !prefersReducedMotion;
    
    if (this.useWebGL) {
      this.webglRenderer = new WebGLRenderer(this.canvas);
    }
  }

  public start(): void {
    if (this.webglRenderer) {
      this.webglRenderer.startAnimation();
    }
  }

  public updateMouse(x: number, y: number): void {
    if (this.webglRenderer) {
      this.webglRenderer.updateMouse(x, y);
    }
  }

  public resize(width: number, height: number): void {
    if (this.webglRenderer) {
      this.webglRenderer.resize(width, height);
    }
  }

  public destroy(): void {
    if (this.webglRenderer) {
      this.webglRenderer.destroy();
    }
  }

  public isUsingWebGL(): boolean {
    return this.useWebGL;
  }
}