/**
 * Portmondo Website Scripts
 * Handles modal, form submission, and smooth interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const supportTrigger = document.getElementById('supportTrigger');
    const supportModal = document.getElementById('supportModal');
    const modalClose = document.getElementById('modalClose');
    const supportForm = document.getElementById('supportForm');
    const formSuccess = document.getElementById('formSuccess');
    const closeSuccess = document.getElementById('closeSuccess');

    // Modal Controls
    function openModal() {
        supportModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        supportModal.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form state after animation
        setTimeout(() => {
            supportForm.classList.remove('hide');
            formSuccess.classList.remove('show');
            supportForm.reset();
        }, 300);
    }

    // Event Listeners
    supportTrigger?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    modalClose?.addEventListener('click', closeModal);
    closeSuccess?.addEventListener('click', closeModal);

    // Close on overlay click
    supportModal?.addEventListener('click', (e) => {
        if (e.target === supportModal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && supportModal?.classList.contains('active')) {
            closeModal();
        }
    });

    // Form Submission
    supportForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = supportForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
            <span>Submitting...</span>
        `;
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(supportForm);
        const data = Object.fromEntries(formData.entries());

        // Add timestamp
        data.submittedAt = new Date().toISOString();

        try {
            // For now, we'll simulate a submission
            // In production, replace this with your actual endpoint
            // e.g., Cloudflare Workers, Formspree, etc.

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Log to console for testing (can be sent to a backend later)
            console.log('Support ticket submitted:', data);

            // Try to send to a webhook if configured
            // Uncomment and configure when ready:
            /*
            const response = await fetch('YOUR_WEBHOOK_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Submission failed');
            */

            // Show success state
            supportForm.classList.add('hide');
            formSuccess.classList.add('show');

        } catch (error) {
            console.error('Submission error:', error);

            // Show error state
            submitBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                </svg>
                <span>Error - Try Again</span>
            `;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);

        } finally {
            if (!supportForm.classList.contains('hide')) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add CSS for spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spinner {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .use-case-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add in-view styles
    const inViewStyle = document.createElement('style');
    inViewStyle.textContent = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(inViewStyle);

    // Stagger animation for grid items
    document.querySelectorAll('.features-grid .feature-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.use-cases .use-case-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
});
