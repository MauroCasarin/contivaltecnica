import Alpine from 'alpinejs';

// Inicialización de Alpine.js
// Fix: Property 'Alpine' does not exist on type 'Window & typeof globalThis'.
(window as any).Alpine = Alpine;
Alpine.start();

/**
 * Lógica principal de Contival Técnica
 * Maneja efectos visuales y rendimiento de la interfaz
 */
const initApp = () => {
    console.log("Contival Técnica App Running");

    // 1. Intersection Observer para animaciones al entrar en pantalla
    const setupAnimations = () => {
        const animatedElements = document.querySelectorAll('.product-card, .distributor-item');
        
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target as HTMLElement;
                        target.classList.add('animate__animated', 'animate__fadeInUp');
                        target.style.opacity = '1';
                    }
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(el => {
                (el as HTMLElement).style.opacity = '0';
                observer.observe(el);
            });
        } else {
            // Fallback para navegadores antiguos
            animatedElements.forEach(el => (el as HTMLElement).style.opacity = '1');
        }
    };

    // 2. Parallax Sincronizado para Fondos Industriales
    const setupParallax = () => {
        const parallaxBgs = [
            { id: 'hero-background', factor: 0.3 },
            { id: 'especialidades-background', factor: 0.3 },
            { id: 'footer-background', factor: 0.3 }
        ];

        const onScroll = () => {
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
                        // Cálculo del desplazamiento relativo
                        // Si es el Hero, se basa en 0. Si no, se ajusta al offset de la sección
                        const relativeScroll = item.id === 'hero-background' 
                            ? yOffset 
                            : (yOffset - (section.offsetTop - vh));
                        
                        bg.style.transform = `translate3d(0, ${relativeScroll * item.factor}px, 0)`;
                    }
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Disparo inicial
    };

    // 3. Sistema de Partículas Ambientales (Efecto Polvo Industrial/Atmósfera)
    const setupParticles = () => {
        const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        
        const resize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }
        };

        class Particle {
            x: number;
            y: number;
            s: number;
            vx: number;
            vy: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.s = Math.random() * 2 + 1;
                this.vx = Math.random() * 0.4 - 0.2;
                this.vy = Math.random() * 0.4 - 0.2;
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
                ctx.fillStyle = 'rgba(0,168,225,0.2)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = Array.from({ length: 80 }, () => new Particle());
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(render);
        };

        init();
        render();
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