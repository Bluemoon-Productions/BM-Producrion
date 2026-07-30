// Invoice List Viewer - 3D Enhanced
// Fetches from Google Apps Script, 3D cards

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Redirect non-admins back to home page
    if (!user || !user.role || user.role.toLowerCase() !== 'admin') {
        window.location.href = '../index.html';
        return;
    }

    // Safe to show admin sidebar
    document.body.classList.add('admin-view');

    await loadInvoices();
});

// Load all invoices
async function loadInvoices() {
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: CONFIG.ACTIONS.GET_INVOICES })
        });
        
        const result = await response.json();
        
        if (result.success && result.invoices.length > 0) {
            displayInvoices(result.invoices);
            updateStats(result.invoices);
            document.getElementById('noInvoices').style.display = 'none';
        } else {
            document.getElementById('noInvoices').style.display = 'block';
            document.getElementById('invoiceList').innerHTML = '';
                updateStats([]); // Reset stats to 0
        }
    } catch (error) {
        console.error('Error:', error);
            // Only show error text if no invoices rendered yet
            if (!document.getElementById('invoiceList').innerHTML) {
                document.getElementById('noInvoices').innerHTML = '<p>Error loading invoices.</p>';
                document.getElementById('noInvoices').style.display = 'block';
            }
    }
}

// Display invoices in 3D cards
function displayInvoices(invoices) {
    document.getElementById('invoiceList').innerHTML = invoices.map((invoice, index) => {
        const statusColor = invoice.status === 'Paid' ? '#28a745' : invoice.status === 'Rejected' ? '#e94560' : '#ffc107';
        const amtRaw = parseFloat(String(invoice.totalAmount || "0").replace(/,/g, '').replace(/₹/g, ''));
        const safeAmount = isNaN(amtRaw) ? 0 : amtRaw;
        return `
            <div class="invoice-card gsap-3d-float" data-gsap="hoverLift">
                <div class="invoice-number">#${invoice.invoiceNo}</div>
                <div class="invoice-meta">
                    <div><i class="fas fa-user"></i> ${invoice.customerName}</div>
                    <div><i class="fas fa-phone"></i> ${invoice.contactNo}</div>
                    <div><i class="fas fa-calendar"></i> ${new Date(invoice.timestamp).toLocaleDateString()}</div>
                    <div><i class="fas fa-tag"></i> <span style="color: ${statusColor}"> ${invoice.status}</span></div>
                </div>
                <div class="invoice-amount">₹${safeAmount.toLocaleString('en-IN')}</div>
                <div class="invoice-actions">
                    <button class="action-btn preview-btn" onclick="previewInvoice('${invoice.pdfUrl}')">
                        👁️ Preview
                    </button>
                    <button class="action-btn share-btn" onclick="shareInvoice('${invoice.pdfUrl}', '${invoice.invoiceNo}')">
                        📤 Share
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteInvoice('${invoice.invoiceNo}')">
                        🗑️ Delete
                    </button>
                    <button class="action-btn update-btn" onclick="openStatusModal('${invoice.invoiceNo}', '${invoice.status}', `${invoice.remark || ''}`)">
                        ✏️ Update
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

// Update dashboard stats
function updateStats(invoices) {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => {
        const amt = parseFloat(String(inv.totalAmount || "0").replace(/,/g, '').replace(/₹/g, ''));
        return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
    const pendingInvoices = totalInvoices - paidInvoices;
    
    document.getElementById('totalInvoices').textContent = totalInvoices;
    document.getElementById('totalAmount').textContent = `₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    document.getElementById('paidInvoices').textContent = paidInvoices;
    document.getElementById('pendingInvoices').textContent = pendingInvoices;
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
    if (confirm('Delete this invoice? This cannot be undone.')) {
        try {
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: CONFIG.ACTIONS.DELETE_INVOICE, invoiceNo })
            });
            const result = await response.json();
            if (result.success) {
                loadInvoices();
                customAlert('Invoice deleted successfully.', 'Deleted', '🗑️');
            }
        } catch (e) {
            customAlert('Error deleting invoice.', 'Error', '✕');
        }
    }
}

// Auto-refresh every 30 seconds
setInterval(loadInvoices, 30000);

// Open status update modal
function openStatusModal(invoiceNo, currentStatus, currentRemark) {
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
                <button class="status-opt-btn ${currentStatus === 'Paid' ? 'active' : ''} paid" data-status="Paid">✅ Paid</button>
                <button class="status-opt-btn ${currentStatus === 'Pending' ? 'active' : ''} pending" data-status="Pending">⏳ Pending</button>
                <button class="status-opt-btn ${currentStatus === 'Rejected' ? 'active' : ''} rejected" data-status="Rejected">❌ Rejected</button>
            </div>

            <div id="remarkSection" style="display: none; margin-top: 18px;">
                <label class="remark-label">Remark</label>
                <textarea id="statusRemark" class="status-remark-input" placeholder="Enter remark..." rows="3">${currentRemark}</textarea>
            </div>

            <button class="status-done-btn" id="statusDoneBtn" onclick="submitStatusUpdate('${invoiceNo}')">Done</button>
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
