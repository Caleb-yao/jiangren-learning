// ── Mobile menu toggle ──
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');
toggle.addEventListener('click', () => menu.classList.toggle('active'));
menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('active'));
});

// ── Back to Top ──
const backToTopBtn = document.getElementById('backToTop');
const SCROLL_THRESHOLD = 300;

// Show / hide based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}, { passive: true });

// Smooth scroll to top on click
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Contact Form ──
const contactForm = document.getElementById('contactForm');

if (contactForm) {

    // ── Validation rules ──
    // Each entry: { check(value) → bool, message(value) → string }
    const EMAIL_RE      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const MSG_MIN_LEN   = 20;

    const VALIDATORS = {
        name: {
            check:   v => v.length > 0,
            message: () => 'Name is required.'
        },
        email: {
            check:   v => v.length > 0 && EMAIL_RE.test(v),
            message: v => v.length === 0
                ? 'Email is required.'
                : 'Please enter a valid email address (e.g. you@example.com).'
        },
        message: {
            check:   v => v.length >= MSG_MIN_LEN,
            message: v => v.length === 0
                ? 'Message is required.'
                : `Message must be at least ${MSG_MIN_LEN} characters (${v.length}/${MSG_MIN_LEN}).`
        }
    };

    // Validate a single field: set/clear has-error and write error text
    function validateField(id) {
        const group   = document.getElementById('group-' + id);
        const input   = document.getElementById(id);
        const errorEl = document.getElementById('error-' + id);
        const value   = input.value.trim();
        const { check, message } = VALIDATORS[id];
        const ok = check(value);

        group.classList.toggle('has-error', !ok);
        if (errorEl) errorEl.textContent = ok ? '' : message(value);
        return ok;
    }

    // Validate all required fields and return true only if all pass
    function validateAll() {
        return ['name', 'email', 'message']
            .map(id => validateField(id))
            .every(Boolean);
    }

    // ── Per-field event listeners ──
    ['name', 'email', 'message'].forEach(id => {
        const input = document.getElementById(id);
        const group = document.getElementById('group-' + id);

        // While typing: re-validate live if the field is already in error state
        // (so user sees the green-light moment the value becomes valid)
        input.addEventListener('input', () => {
            if (group.classList.contains('has-error')) {
                validateField(id);
            }
        });

        // On blur (leaving the field): always validate
        input.addEventListener('blur', () => {
            validateField(id);
        });
    });

    // ── Toast system ──
    // showToast(message, 'success' | 'error')
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        // Auto-dismiss: fade out after 3.5 s, then remove from DOM
        const VISIBLE_MS = 3500;
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        }, VISIBLE_MS);
    }

    // ── Submit handler (async, uses fetch) ──
    //
    // Mock endpoints:
    //   Success → https://jsonplaceholder.typicode.com/posts  (returns 201)
    //   Failure → append ?fail=1 to the page URL to force a 500 response
    //             e.g. index.html?fail=1
    //
    const FORCE_ERROR = new URLSearchParams(window.location.search).has('fail');
    const ENDPOINT = FORCE_ERROR
        ? 'https://httpstat.us/500'                       // always returns 500
        : 'https://jsonplaceholder.typicode.com/posts';   // always returns 201

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Validation gate
        if (!validateAll()) return;

        const btn     = document.getElementById('submitBtn');
        const btnText = btn.querySelector('.btn-submit-text');

        // 2. Loading state — disable button, show spinner
        btn.disabled = true;
        btn.classList.add('loading');
        btnText.textContent = 'Sending…';

        // 3. Collect form data
        const payload = {
            name:    document.getElementById('name').value.trim(),
            email:   document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim(),
        };

        try {
            // 4. Send request
            const res = await fetch(ENDPOINT, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Server error ${res.status}`);

            // ── SUCCESS path ──
            btn.classList.remove('loading');
            btn.classList.add('success');
            btnText.textContent = '✓ Sent!';

            contactForm.reset();                          // clear all fields
            showToast('Your message has been sent successfully!', 'success');

            // Restore button after 2.5 s
            setTimeout(() => {
                btn.disabled = false;
                btn.classList.remove('success');
                btnText.textContent = 'Send Message';
            }, 2500);

        } catch (err) {
            // ── FAILURE path — keep form content ──
            btn.disabled = false;
            btn.classList.remove('loading');
            btnText.textContent = 'Send Message';

            showToast('Something went wrong. Please try again later.', 'error');
            console.error('[ContactForm]', err.message);
        }
    });
}
