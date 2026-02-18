import Alpine from 'alpinejs';

/**
 * Contival Técnica - Core Engine
 * Diseño robusto para garantizar funcionamiento en cualquier servidor y dispositivo.
 */

// 1. Inicialización Global de Alpine.js
(window as any).Alpine = Alpine;

const initApp = () => {
    console.log("Contival Técnica: Sincronizando efectos visuales...");

    // --- MÓDULO: ANIMACIONES DE ENTRADA ---
    const setupAnimations = () => {
        const animatedElements = document.querySelectorAll('.product-card, .distributor-item');
        if (animatedElements.length === 0) return;

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target as HTMLElement;
                        target.classList.add('animate__animated', 'animate__fadeInUp');
                        target.style.opacity = '1';
                        observer.unobserve(target);
                    }
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(el => {
                (el as HTMLElement).style.opacity = '0';
                observer.observe(el);
            });
        } else {
            animatedElements.forEach(el => (el as HTMLElement).style.opacity = '1');
        }
    };

    // --- MÓDULO: PARALLAX INDUSTRIAL (Sincronizado y Fluido) ---
    const setupParallax = () => {
        // Factores sutiles para un movimiento más "pesado" y fluido (Slower motion)
        const parallaxBgs = [
            { id: 'hero-background', factor: 0.04 },
            { id: 'especialidades-background', factor: 0.03 },
            { id: 'footer-background', factor: 0.04 }
        ];

        let ticking = false;

        const updateParallax = () => {
            const yOffset = window.scrollY;
            const vh = window.innerHeight;

            parallaxBgs.forEach(item => {
                const bg = document.getElementById(item.id);
                if (!bg) return;

                const section = bg.parentElement;
                if (!section) return;
                
                const rect = section.getBoundingClientRect();
                const inView = rect.top < vh && rect.bottom > 0;
                
                if (inView) {
                    // Cálculo de desplazamiento relativo al centro del viewport
                    const sectionCenter = (rect.top + yOffset) + (section.offsetHeight / 2);
                    const viewportCenter = yOffset + (vh / 2);
                    const relativeDistance = viewportCenter - sectionCenter;
                    
                    // Aplicación de transform con GPU
                    bg.style.transform = `translate3d(0, ${relativeDistance * item.factor}px, 0)`;
                }
            });
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        // Disparo inicial
        updateParallax();
    };

    // --- MÓDULO: PARTÍCULAS ATMOSFÉRICAS ---
    const setupParticles = () => {
        const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrame: number;
        
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }
        };

        class Particle {
            x: number; y: number; s: number; vx: number; vy: number; alpha: number;
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.s = Math.random() * 1.5 + 0.5;
                this.vx = Math.random() * 0.3 - 0.15;
                this.vy = Math.random() * 0.3 - 0.15;
                this.alpha = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(0,168,225,${this.alpha})`;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2); ctx.fill();
            }
        }

        const init = () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            resize();
            const count = window.innerWidth < 768 ? 25 : 50;
            particles = Array.from({ length: count }, () => new Particle());
            render();
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animationFrame = requestAnimationFrame(render);
        };

        init();
        window.addEventListener('resize', init);
    };

    // Ejecutar módulos de forma aislada para evitar que fallos parciales bloqueen todo el sitio
    const modules = [setupAnimations, setupParallax, setupParticles];
    modules.forEach(fn => {
        try { fn(); } catch (e) { console.error("Modulo fallido:", e); }
    });
};

// 2. Control de Ciclo de Vida Mejorado
const startEverything = () => {
    if ((window as any)._appInitialized) return;
    (window as any)._appInitialized = true;
    initApp();
    Alpine.start();
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startEverything();
} else {
    document.addEventListener('DOMContentLoaded', startEverything);
}