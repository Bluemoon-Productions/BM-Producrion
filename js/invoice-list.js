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
        const statusColor = invoice.status === 'Paid' ? '#28a745' : '#ffc107';
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

// Custom alert (reuse from utils)
if (!window.customAlert) {
    window.customAlert = async (message, title = 'Info', icon = 'ℹ️', showConfirm = false) => {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'custom-modal';
            modal.innerHTML = `
                <div class="custom-modal-content">
                    <div class="custom-modal-header">
                        <div class="custom-modal-icon">${icon}</div>
                        <h2 class="custom-modal-title">${title}</h2>
                    </div>
                    <div class="custom-modal-body">
                        <p class="custom-modal-message">${message}</p>
                    </div>
                    <div class="custom-modal-footer">
                        <button class="custom-modal-btn custom-modal-btn-primary" onclick="this.closest('.custom-modal').remove(); resolve();">
                            OK
                        </button>
                        ${showConfirm ? '<button class="custom-modal-btn custom-modal-btn-secondary" onclick="this.closest(\'.custom-modal\').remove(); resolve(true);">Confirm</button>' : ''}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        });
    };
}
