/**
 * SkyCast Atmospheric Canvas Engine
 * High-performance ambient particle canvas (Rain, Snow, Lightning, Stars, Golden Solar Flecks)
 */

class WeatherParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.animationId = null;
    this.particles = [];
    this.currentCondition = 'clear-day';

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('resize', this.resize, { passive: true });
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles(this.currentCondition);
  }

  setCondition(condition) {
    this.currentCondition = condition;
    this.initParticles(condition);
  }

  initParticles(condition) {
    if (!this.canvas) return;
    const count = condition === 'rain' ? 140 : (condition === 'storm' ? 180 : (condition === 'snow' ? 85 : 45));
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedY: (condition === 'rain' || condition === 'storm')
          ? Math.random() * 8 + 10
          : (condition === 'snow' ? Math.random() * 1.5 + 0.8 : Math.random() * 0.4 + 0.1),
        speedX: (condition === 'rain' || condition === 'storm')
          ? -1.2
          : (condition === 'snow' ? Math.sin(i) * 0.6 : (Math.random() - 0.5) * 0.3),
        opacity: Math.random() * 0.5 + 0.2,
        radius: Math.random() * 3 + 1,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  loop() {
    if (!this.ctx || !this.canvas) return;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const condition = this.currentCondition;
    const now = Date.now();
    const isLight = document.documentElement.classList.contains('light-mode');

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.beginPath();

      if (condition === 'rain' || condition === 'storm') {
        ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${p.opacity * 0.95})` : `rgba(125, 211, 252, ${p.opacity * 0.85})`;
        ctx.lineWidth = condition === 'storm' ? 2 : 1.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.speedX * 2.2, p.y + p.speedY * 1.8);
        ctx.stroke();
      } else if (condition === 'snow') {
        ctx.fillStyle = isLight ? `rgba(100, 116, 139, ${p.opacity * 0.9})` : `rgba(240, 249, 255, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.radius * 0.85, 0, Math.PI * 2);
        ctx.fill();
      } else if (condition === 'night') {
        const twinkle = Math.sin(now * 0.0025 + p.twinklePhase) * 0.4 + 0.6;
        ctx.fillStyle = isLight ? `rgba(71, 85, 105, ${p.opacity * twinkle})` : `rgba(255, 255, 255, ${p.opacity * twinkle})`;
        ctx.arc(p.x, p.y, p.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Clear Day ambient dust / solar flecks
        ctx.fillStyle = isLight ? `rgba(217, 119, 6, ${p.opacity * 0.4})` : `rgba(255, 225, 160, ${p.opacity * 0.35})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
    }

    this.animationId = requestAnimationFrame(this.loop);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    window.removeEventListener('resize', this.resize);
  }
}

window.WeatherParticleEngine = WeatherParticleEngine;
