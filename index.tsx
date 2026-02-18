import Alpine from 'alpinejs';

// Inicialización de Alpine.js
(window as any).Alpine = Alpine;
Alpine.start();

/**
 * Lógica principal de Contival Técnica
 * Optimizada para PC y Dispositivos Móviles
 */
const initApp = () => {
    console.log("Contival Técnica App Running - High Performance Mode");

    // 1. Intersection Observer para animaciones (Optimizado)
    const setupAnimations = () => {
        const animatedElements = document.querySelectorAll('.product-card, .distributor-item');
        
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target as HTMLElement;
                        target.classList.add('animate__animated', 'animate__fadeInUp');
                        target.style.opacity = '1';
                        observer.unobserve(target); // Dejamos de observar tras animar para ahorrar recursos
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                (el as HTMLElement).style.opacity = '0';
                observer.observe(el);
            });
        } else {
            animatedElements.forEach(el => (el as HTMLElement).style.opacity = '1');
        }
    };

    // 2. Motor de Parallax Multi-Dispositivo (Optimizado)
    const setupParallax = () => {
        const parallaxBgs = [
            { id: 'hero-background', factor: 0.12 },
            { id: 'especialidades-background', factor: 0.10 },
            { id: 'footer-background', factor: 0.12 }
        ];

        // Función de renderizado por frame para mayor fluidez
        let ticking = false;

        const updateParallax = () => {
            const yOffset = window.scrollY;
            const vh = window.innerHeight;

            parallaxBgs.forEach(item => {
                const bg = document.getElementById(item.id);
                if (bg) {
                    const section = bg.parentElement;
                    if (!section) return;
                    
                    const rect = section.getBoundingClientRect();
                    const inView = rect.top < vh && rect.bottom > 0;
                    
                    if (inView) {
                        // Cálculo robusto: posición relativa al viewport
                        const sectionTopAbsolute = rect.top + yOffset;
                        const sectionCenter = sectionTopAbsolute + section.offsetHeight / 2;
                        const viewportCenter = yOffset + vh / 2;
                        const relativeDistance = viewportCenter - sectionCenter;
                        
                        // Usamos transform3d para aceleración por GPU
                        bg.style.transform = `translate3d(0, ${relativeDistance * item.factor}px, 0)`;
                    }
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
        window.addEventListener('resize', updateParallax);
        updateParallax();
    };

    // 3. Sistema de Partículas Ambientales (Optimizado)
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
            x: number;
            y: number;
            s: number;
            vx: number;
            vy: number;
            alpha: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.s = Math.random() * 1.5 + 0.5;
                this.vx = Math.random() * 0.3 - 0.15;
                this.vy = Math.random() * 0.3 - 0.15;
                this.alpha = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(0,168,225,${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            cancelAnimationFrame(animationFrame);
            resize();
            // Menos partículas en pantallas pequeñas para ahorrar batería
            const count = window.innerWidth < 768 ? 40 : 80;
            particles = Array.from({ length: count }, () => new Particle());
            render();
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrame = requestAnimationFrame(render);
        };

        init();
        window.addEventListener('resize', init);
    };

    // Ejecución de módulos
    setupAnimations();
    setupParallax();
    setupParticles();
};

// Asegurar que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}