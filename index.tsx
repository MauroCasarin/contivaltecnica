import Alpine from 'alpinejs';

/**
 * Contival Técnica - Core Engine
 * Diseño robusto para garantizar funcionamiento en cualquier servidor y dispositivo.
 */

// 1. Inicialización Global de Alpine.js
// La asignamos al objeto window para que el HTML pueda ver las variables de estado inmediatamente.
(window as any).Alpine = Alpine;

// Función de inicialización de la lógica personalizada
const initApp = () => {
    console.log("Contival Técnica: Inicializando módulos técnicos...");

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

    // --- MÓDULO: PARALLAX INDUSTRIAL (Robusto) ---
    const setupParallax = () => {
        const parallaxBgs = [
            { id: 'hero-background', factor: 0.12 },
            { id: 'especialidades-background', factor: 0.10 },
            { id: 'footer-background', factor: 0.12 }
        ];

        let ticking = false;

        const updateParallax = () => {
            const yOffset = window.scrollY;
            const vh = window.innerHeight;

            parallaxBgs.forEach(item => {
                const bg = document.getElementById(item.id);
                if (!bg) return; // Guarda de seguridad

                const section = bg.parentElement;
                if (!section) return;
                
                const rect = section.getBoundingClientRect();
                const inView = rect.top < vh && rect.bottom > 0;
                
                if (inView) {
                    const sectionCenter = (rect.top + yOffset) + (section.offsetHeight / 2);
                    const viewportCenter = yOffset + (vh / 2);
                    const relativeDistance = viewportCenter - sectionCenter;
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
            const count = window.innerWidth < 768 ? 30 : 60;
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

    // Ejecutar todos los módulos de forma segura
    try { setupAnimations(); } catch (e) { console.error("Error en Animaciones:", e); }
    try { setupParallax(); } catch (e) { console.error("Error en Parallax:", e); }
    try { setupParticles(); } catch (e) { console.error("Error en Partículas:", e); }
};

// 2. Ciclo de Vida: Aseguramos que Alpine comience DESPUÉS de definir la lógica de la App
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        Alpine.start();
    });
} else {
    initApp();
    Alpine.start();
}