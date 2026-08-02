// Admin Sidebar — bottom-up panel (desktop) / bottom bar (mobile)

(function () {
    const OPEN_KEY     = 'adminBarOpen';
    const COLLAPSE_KEY = 'adminBarCollapsed';

    let observer      = null;
    let observing     = false;
    let sidebarReady  = false;

    function isDesktop() { return window.innerWidth >= 769; }
    function isAdmin()   { return document.body.classList.contains('admin-view'); }

    // Pause / resume observer so our own class changes don't re-trigger it
    function pauseObserver()  { if (observer && observing) { observer.disconnect(); observing = false; } }
    function resumeObserver() {
        if (observer && !observing) {
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            observing = true;
        }
    }

    // ── Trigger tab ───────────────────────────────────────────────
    function createTriggerTab() {
        if (document.getElementById('adminTriggerTab')) return;
        const tab = document.createElement('div');
        tab.id        = 'adminTriggerTab';
        tab.className = 'admin-trigger-tab';
        tab.innerHTML = `<i class="fas fa-chevron-up tab-arrow"></i><span>Admin Menu</span>`;
        tab.addEventListener('click', openBar);
        document.body.appendChild(tab);
    }

    function removeTriggerTab() {
        const tab = document.getElementById('adminTriggerTab');
        if (tab) tab.remove();
    }

    // ── Collapse button ───────────────────────────────────────────
    function ensureCollapseBtn(sidebar) {
        if (sidebar.querySelector('.admin-collapse-btn')) return;
        const btn = document.createElement('div');
        btn.className = 'admin-collapse-btn';
        btn.title     = 'Collapse menu';
        btn.innerHTML = `<i class="fas fa-angles-left"></i>`;
        btn.addEventListener('click', toggleCollapse);
        sidebar.appendChild(btn);
    }

    // ── Sidebar header → close ────────────────────────────────────
    function bindHeader(sidebar) {
        const header = sidebar.querySelector('.admin-sidebar-header');
        if (header && !header.dataset.bound) {
            header.dataset.bound = '1';
            header.title  = 'Close menu';
            header.style.cursor = 'pointer';
            header.addEventListener('click', closeBar);
        }
    }

    // ── Tooltips ──────────────────────────────────────────────────
    function setLabels(sidebar) {
        sidebar.querySelectorAll('.admin-menu-item').forEach(item => {
            const text = item.querySelector('.text');
            if (text && !item.dataset.label) {
                item.setAttribute('data-label', text.textContent.trim());
            }
        });
    }

    // ── Open / Close / Collapse — pause observer during changes ──
    function openBar() {
        pauseObserver();
        document.body.classList.add('admin-bar-open');
        localStorage.setItem(OPEN_KEY, 'true');
        resumeObserver();
    }

    function closeBar() {
        pauseObserver();
        document.body.classList.remove('admin-bar-open');
        localStorage.setItem(OPEN_KEY, 'false');
        resumeObserver();
    }

    function toggleCollapse() {
        pauseObserver();
        const collapsed = document.body.classList.toggle('admin-bar-collapsed');
        localStorage.setItem(COLLAPSE_KEY, collapsed);
        const btn = document.querySelector('.admin-collapse-btn');
        if (btn) btn.title = collapsed ? 'Expand menu' : 'Collapse menu';
        resumeObserver();
    }

    // ── Restore persisted open/collapse state ─────────────────────
    function restoreState() {
        pauseObserver();
        if (localStorage.getItem(OPEN_KEY)     === 'true') document.body.classList.add('admin-bar-open');
        if (localStorage.getItem(COLLAPSE_KEY) === 'true') document.body.classList.add('admin-bar-collapsed');
        resumeObserver();
    }

    // ── Setup desktop sidebar once ────────────────────────────────
    function setupDesktop() {
        if (sidebarReady) return;
        const sidebar = document.getElementById('adminSidebar');
        if (!sidebar) return;

        setLabels(sidebar);
        ensureCollapseBtn(sidebar);
        bindHeader(sidebar);
        sidebarReady = true;
    }

    // ── Respond to admin-view class being added/removed ───────────
    function onAdminClassChange() {
        if (!isDesktop()) return;

        setupDesktop();

        if (isAdmin()) {
            createTriggerTab();
            restoreState();
        } else {
            removeTriggerTab();
            pauseObserver();
            document.body.classList.remove('admin-bar-open', 'admin-bar-collapsed');
            resumeObserver();
        }
    }

    // ── Watch body class for login/logout ─────────────────────────
    function startObserver() {
        observer = new MutationObserver(onAdminClassChange);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        observing = true;
    }

    // ── Init ──────────────────────────────────────────────────────
    function init() {
        startObserver();

        if (isDesktop()) {
            setupDesktop();
            if (isAdmin()) {
                createTriggerTab();
                restoreState();
            }
        }

        window.addEventListener('resize', () => {
            if (isDesktop()) {
                setupDesktop();
                if (isAdmin()) createTriggerTab();
            } else {
                removeTriggerTab();
                pauseObserver();
                document.body.classList.remove('admin-bar-open', 'admin-bar-collapsed');
                resumeObserver();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
