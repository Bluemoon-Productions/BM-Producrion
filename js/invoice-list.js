// Invoice List Viewer - 3D Enhanced

let allInvoices = [];

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.role || user.role.toLowerCase() !== 'admin') {
        window.location.href = '../index.html';
        return;
    }
    document.body.classList.add('admin-view');
    await loadInvoices();
});

async function loadInvoices() {
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: CONFIG.ACTIONS.GET_INVOICES })
        });
        const result = await response.json();
        console.log('[Invoice] API result:', JSON.stringify(result).slice(0, 500));

        if (result.success && Array.isArray(result.invoices) && result.invoices.length > 0) {
            allInvoices = result.invoices;
            console.log('[Invoice] Sample invoice:', result.invoices[0]);
        } else {
            allInvoices = [];
        }
        renderInvoices(allInvoices);
    } catch (error) {
        console.error('[Invoice] Load error:', error);
        // Only show error state if no invoices are currently displayed
        if (allInvoices.length === 0) {
            document.getElementById('noInvoices').innerHTML = `
                <i class="fas fa-inbox" style="font-size:4rem;color:#ccc;margin-bottom:20px"></i>
                <h2>No Invoices Found</h2>
                <p>Create your first invoice to get started.</p>
                <a href="invoice.html" class="generate-new-btn">➕ Create First Invoice</a>`;
            document.getElementById('noInvoices').style.display = 'block';
            updateStats([]);
        }
    }
}

function applyDateFilter() {
    const from   = document.getElementById('filterFrom').value;
    const to     = document.getElementById('filterTo').value;
    const status = document.getElementById('filterStatus').value;

    const fromDate = from ? new Date(from) : null;
    const toDate   = to   ? new Date(to + 'T23:59:59') : null;

    const filtered = allInvoices.filter(inv => {
        if (status !== 'all' && (inv.status || '').toLowerCase() !== status.toLowerCase()) return false;
        const d = new Date(inv.timestamp);
        if (fromDate && d < fromDate) return false;
        if (toDate   && d > toDate)   return false;
        return true;
    });
    renderInvoices(filtered);
}

function clearDateFilter() {
    document.getElementById('filterFrom').value  = '';
    document.getElementById('filterTo').value    = '';
    document.getElementById('filterStatus').value = 'all';
    renderInvoices(allInvoices);
}

function renderInvoices(invoices) {
    updateStats(invoices);
    if (invoices.length > 0) {
        displayInvoices(invoices);
        document.getElementById('noInvoices').style.display = 'none';
    } else {
        document.getElementById('invoiceList').innerHTML = '';
        document.getElementById('noInvoices').innerHTML = `
            <i class="fas fa-inbox" style="font-size:4rem;color:#ccc;margin-bottom:20px"></i>
            <h2>No Invoices Found</h2>
            <p>Create your first invoice to get started.</p>
            <a href="invoice.html" class="generate-new-btn">➕ Create First Invoice</a>`;
        document.getElementById('noInvoices').style.display = 'block';
    }
}

// Display invoices in 3D cards
function displayInvoices(invoices) {
    document.getElementById('invoiceList').innerHTML = invoices.map((invoice, index) => {
        const statusColor = invoice.status === 'Paid' ? '#28a745' : invoice.status === 'Rejected' ? '#e94560' : '#ffc107';
        const safeAmt = safeAmount(invoice.totalAmount);
        const safeAdv = safeAmount(invoice.advancePayment);
        return `
            <div class="invoice-card gsap-3d-float" data-gsap="hoverLift">
                <div class="invoice-number">#${invoice.invoiceNo}</div>
                <div class="invoice-meta">
                    <div><i class="fas fa-user"></i> ${invoice.customerName}</div>
                    <div><i class="fas fa-phone"></i> ${invoice.customerPhone}</div>
                    <div><i class="fas fa-calendar"></i> ${new Date(invoice.timestamp).toLocaleDateString()}</div>
                    <div><i class="fas fa-tag"></i> <span style="color: ${statusColor}"> ${invoice.status}</span></div>
                </div>
                <div class="invoice-amount">₹${safeAdv.toLocaleString('en-IN')} <span class="amt-divider">/</span> ₹${safeAmt.toLocaleString('en-IN')}</div>
                <div class="invoice-amount-label">Advance / Total</div>
                <div class="invoice-actions">
                    <button class="inv-btn inv-preview" onclick="previewInvoice('${invoice.pdfUrl}')" title="Preview">
                        <i class="fas fa-eye"></i><span>Preview</span>
                    </button>
                    <button class="inv-btn inv-share" onclick="shareInvoice('${invoice.pdfUrl}', '${invoice.invoiceNo}')" title="Share">
                        <i class="fas fa-share-alt"></i><span>Share</span>
                    </button>
                    <button class="inv-btn inv-update" onclick="openStatusModal('${invoice.invoiceNo}', '${invoice.status}', '${invoice.remark || ''}', '${invoice.pdfUrl}')" title="Update Status">
                        <i class="fas fa-pen"></i><span>Update</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // GSAP hover animations
    gsap.utils.toArray('.invoice-card[data-gsap="hoverLift"]').forEach((card, i) => {
        gsap.to(card, {
            rotateY: 8,
            rotateX: 4,
            y: -20,
            duration: 0.6,
            ease: 'power2.out',
            paused: true,
            onComplete: () => gsap.set(card, { rotateY: 0, rotateX: 0, y: 0 })
        });
        
        card.addEventListener('mouseenter', () => gsap.to(card, { rotateY: 8, rotateX: 4, y: -20, duration: 0.6, ease: 'power2.out' }));
        card.addEventListener('mouseleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.6, ease: 'power2.out' }));
    });
}

function safeAmount(val) {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    const n = parseFloat(String(val).replace(/[₹,\s]/g, ''));
    return isNaN(n) ? 0 : n;
}

function setStatEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// Update dashboard stats — always computed fresh from the passed array
function updateStats(invoices) {
    let total = 0;
    let paidCount = 0,    paidAmt = 0;
    let pendingCount = 0, pendingAmt = 0;
    let genCount = 0,     genAmt = 0;
    let totalAmount = 0;

    for (let i = 0; i < invoices.length; i++) {
        const inv = invoices[i];
        const amt = safeAmount(inv.totalAmount);
        const s   = (inv.status || '').trim();
        total++;
        totalAmount += amt;
        if (s === 'Paid')      { paidCount++;    paidAmt    += amt; }
        if (s === 'Pending')   { pendingCount++; pendingAmt += amt; }
        if (s === 'Generated') { genCount++;     genAmt     += amt; }
    }

    const fmt = v => '₹' + v.toLocaleString('en-IN', { maximumFractionDigits: 2 });

    setStatEl('totalInvoices',   total);
    setStatEl('paidCount',       paidCount);
    setStatEl('pendingCount',    pendingCount);
    setStatEl('generatedCount',  genCount);
    setStatEl('totalAmount',     fmt(totalAmount));
    setStatEl('paidAmount',      fmt(paidAmt));
    setStatEl('pendingAmount',   fmt(pendingAmt));
    setStatEl('generatedAmount', fmt(genAmt));
}

// Preview, share, delete functions (same as invoice.html)
async function previewInvoice(pdfUrl) {
    if (pdfUrl && !pdfUrl.includes('Error')) {
        let fileId = pdfUrl.split('/d/')[1]?.split('/')[0] || pdfUrl.split('id=')[1]?.split('&')[0] || '';
        const previewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : pdfUrl;
        
        const modal = document.createElement('div');
        modal.className = 'invoice-modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="invoice-modal-content" style="height: 85vh;">
                <span class="close-invoice-modal" onclick="this.closest('.invoice-modal').style.display='none'">&times;</span>
                <h2>Invoice Preview</h2>
                <iframe src="${previewUrl}" style="width: 100%; height: calc(100% - 100px); border: none; border-radius: 5px;" allow="autoplay"></iframe>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
    } else {
        customAlert('PDF not available.', 'Not Available', 'ℹ️');
    }
}

async function shareInvoice(pdfUrl, invoiceNo) {
    if (navigator.share) {
        navigator.share({
            title: `Invoice ${invoiceNo}`,
            text: `Invoice ${invoiceNo}`,
            url: pdfUrl
        });
    } else {
        navigator.clipboard.writeText(pdfUrl).then(async () => {
            customAlert('Link copied!', 'Copied', '📋');
        });
    }
}

async function deleteInvoice(invoiceNo) {
    if (!await customConfirm('This invoice will be hidden from the list but kept in the sheet.', 'Delete Invoice?', '🗑️')) return;
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: CONFIG.ACTIONS.DELETE_INVOICE, invoiceNo })
        });
        const result = await response.json();
        if (result.success) {
            const m = document.getElementById('statusUpdateModal');
            if (m) m.remove();
            loadInvoices();
            customAlert('Invoice deleted successfully.', 'Deleted', '🗑️');
        }
    } catch (e) {
        customAlert('Error deleting invoice.', 'Error', '✕');
    }
}

// Auto-refresh every 30 seconds (re-applies active filter)
setInterval(async () => {
    await loadInvoices();
    const from = document.getElementById('filterFrom')?.value;
    const to   = document.getElementById('filterTo')?.value;
    if (from || to) applyDateFilter();
}, 30000);

// Open status update modal
function openStatusModal(invoiceNo, currentStatus, currentRemark, pdfUrl) {
    const existing = document.getElementById('statusUpdateModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'statusUpdateModal';
    modal.className = 'invoice-modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="invoice-modal-content status-modal-content">
            <span class="close-invoice-modal" onclick="document.getElementById('statusUpdateModal').remove()">&times;</span>
            <h2>✏️ Update Invoice Status</h2>
            <p class="status-invoice-no">Invoice: <strong>#${invoiceNo}</strong></p>

            <div class="status-options">
                <button class="status-opt-btn ${currentStatus === 'Paid' ? 'active' : ''} paid" data-status="Paid"><i class="fas fa-check-circle"></i> Paid</button>
                <button class="status-opt-btn ${currentStatus === 'Pending' ? 'active' : ''} pending" data-status="Pending"><i class="fas fa-clock"></i> Pending</button>
                <button class="status-opt-btn ${currentStatus === 'Rejected' ? 'active' : ''} rejected" data-status="Rejected"><i class="fas fa-times-circle"></i> Rejected</button>
            </div>

            <div id="remarkSection" style="display: none; margin-top: 18px;">
                <label class="remark-label">Remark</label>
                <textarea id="statusRemark" class="status-remark-input" placeholder="Enter remark..." rows="3">${currentRemark}</textarea>
            </div>

            <div class="status-modal-actions">
                <button class="inv-btn inv-preview" onclick="previewInvoice('${pdfUrl}')">
                    <i class="fas fa-eye"></i><span>Preview</span>
                </button>
                <button class="inv-btn inv-delete" onclick="deleteInvoice('${invoiceNo}')">
                    <i class="fas fa-trash-alt"></i><span>Delete</span>
                </button>
            </div>
            <div class="status-modal-confirm">
                <button class="inv-btn inv-cancel" onclick="document.getElementById('statusUpdateModal').remove()">
                    <i class="fas fa-times"></i><span>Cancel</span>
                </button>
                <button class="inv-btn inv-done" onclick="submitStatusUpdate('${invoiceNo}')">
                    <i class="fas fa-check"></i><span>Done</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Show remark for Pending and Rejected by default if already selected
    let selected = currentStatus;
    const remarkSection = modal.querySelector('#remarkSection');
    if (selected === 'Pending' || selected === 'Rejected') remarkSection.style.display = 'block';

    modal.querySelectorAll('.status-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.status-opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selected = btn.dataset.status;
            remarkSection.style.display = (selected === 'Pending' || selected === 'Rejected') ? 'block' : 'none';
        });
    });

    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

async function submitStatusUpdate(invoiceNo) {
    const modal = document.getElementById('statusUpdateModal');
    const activeBtn = modal.querySelector('.status-opt-btn.active');
    if (!activeBtn) { customAlert('Please select a status.', 'Warning', '⚠️'); return; }

    const status = activeBtn.dataset.status;
    const remark = modal.querySelector('#statusRemark')?.value.trim() || '';

    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: CONFIG.ACTIONS.UPDATE_STATUS, invoiceNo, status, remark })
        });
        const result = await response.json();
        if (result.success) {
            modal.remove();
            await loadInvoices();
            customAlert('Status updated successfully!', 'Updated', '✅');
        } else {
            customAlert('Error: ' + result.error, 'Error', '✕');
        }
    } catch (e) {
        customAlert('Error updating status.', 'Error', '✕');
    }
}

// customAlert is provided by utils.js which is loaded before this script
