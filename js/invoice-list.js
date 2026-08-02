// Invoice List Viewer - 3D Enhanced

let allInvoices = [];
let bgRefreshTimer = null;

// ---- Cache helpers ----
const CACHE_KEY = 'bm_invoices_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 min TTL for stale check only
function saveCache(invoices) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), invoices }));
}
function loadCache() {
    try {
        const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        if (c && Array.isArray(c.invoices)) return c; // return full object {ts, invoices}
    } catch(e) {}
    return null;
}
function clearCache() { localStorage.removeItem(CACHE_KEY); }

function showLoader() {
    const el = document.getElementById('listLoader');
    if (el) el.style.display = 'flex';
}
function hideLoader() {
    const el = document.getElementById('listLoader');
    if (el) el.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.role || user.role.toLowerCase() !== 'admin') {
        window.location.href = '../index.html';
        return;
    }
    document.body.classList.add('admin-view');
    await loadInvoices();
});

async function fetchFromServer() {
    const response = await fetch(CONFIG.SCRIPT_URL, {
        method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: CONFIG.ACTIONS.GET_INVOICES })
    });
    const result = await response.json();
    if (result.success && Array.isArray(result.invoices)) {
        saveCache(result.invoices);
        return result.invoices;
    }
    return null;
}

async function loadInvoices() {
    const cached = loadCache();

    if (cached && cached.invoices.length > 0) {
        // Show cached data immediately — no loader flash
        allInvoices = cached.invoices;
        renderInvoices(allInvoices);
        hideLoader();
        // If cache is stale (>5min), refresh in background silently
        if (Date.now() - cached.ts > CACHE_TTL) {
            fetchFromServer().then(fresh => {
                if (fresh) { allInvoices = fresh; renderInvoices(allInvoices); }
            }).catch(() => {});
        }
        startBgRefresh();
        return;
    }

    // No cache — must fetch, show loader
    showLoader();
    try {
        const fresh = await fetchFromServer();
        allInvoices = fresh || [];
        renderInvoices(allInvoices);
    } catch (error) {
        console.error('[Invoice] Load error:', error);
        document.getElementById('noInvoices').innerHTML = `
            <i class="fas fa-inbox" style="font-size:4rem;color:#ccc;margin-bottom:20px"></i>
            <h2>No Invoices Found</h2>
            <p>Create your first invoice to get started.</p>
            <a href="invoice.html" class="generate-new-btn">➕ Create First Invoice</a>`;
        document.getElementById('noInvoices').style.display = 'block';
        updateStats([]);
    } finally {
        hideLoader();
    }
    startBgRefresh();
}

// Background refresh every 60s — updates cache + UI silently, no page reload
function startBgRefresh() {
    if (bgRefreshTimer) return; // already running
    bgRefreshTimer = setInterval(async () => {
        try {
            const fresh = await fetchFromServer();
            if (fresh) {
                allInvoices = fresh;
                // Re-apply current filter so UI stays consistent
                applyDateFilter();
            }
        } catch(e) { /* silent fail */ }
    }, 60 * 1000);
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

// Helper: classify paid invoice
function paidType(inv) {
    const fp = (inv.finalPayment || '').trim();
    const rm = (inv.remark || '').trim();
    if (inv.status !== 'Paid') return null;
    if (!fp && !rm) return 'advance';        // advance paid only
    if (fp && !rm)  return 'final';          // final paid (received or not)
    if (!fp && rm)  return 'final_not';      // final not received (has remark, no finalPayment)
    return 'final';
}

// Display invoices in 3D cards
function displayInvoices(invoices) {
    document.getElementById('invoiceList').innerHTML = invoices.map((invoice, index) => {
        const s = (invoice.status || '').trim();
        const pt = paidType(invoice);
        const statusColor = s === 'Paid' ? '#28a745' : s === 'Rejected' ? '#e94560' : '#ffc107';
        const statusLabel = s === 'Paid' ? (pt === 'advance' ? 'Advance Paid' : pt === 'final' ? 'Final Paid' : 'Final Not Paid') : s;
        const safeAmt = safeAmount(invoice.totalAmount);
        const safeAdv = safeAmount(invoice.advancePayment);
        // editable: not paid, or advance paid only
        const isEditable = s !== 'Paid' || pt === 'advance';
        return `
            <div class="invoice-card gsap-3d-float" data-gsap="hoverLift">
                <div class="invoice-number">#${invoice.invoiceNo}</div>
                <div class="invoice-meta">
                    <div><i class="fas fa-user"></i> ${invoice.customerName}</div>
                    <div><i class="fas fa-phone"></i> ${invoice.customerPhone}</div>
                    <div><i class="fas fa-calendar"></i> ${new Date(invoice.timestamp).toLocaleDateString()}</div>
                    <div><i class="fas fa-tag"></i> <span style="color: ${statusColor}"> ${statusLabel}</span></div>
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
                    ${isEditable ? `<button class="inv-btn inv-update" onclick="openStatusModal(this)" data-invoice='${JSON.stringify(invoice).replace(/'/g, "&apos;")}' title="Update Status"><i class="fas fa-pen"></i><span>Update</span></button>` : ''}
                </div>
            </div>
        `;
    }).join('');

    if (typeof gsap !== 'undefined' && gsap.utils) {
        gsap.utils.toArray('.invoice-card[data-gsap="hoverLift"]').forEach(card => {
            card.addEventListener('mouseenter', () => gsap.to(card, { rotateY: 8, rotateX: 4, y: -20, duration: 0.6, ease: 'power2.out' }));
            card.addEventListener('mouseleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, y: 0,   duration: 0.6, ease: 'power2.out' }));
        });
    }
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
        const adv = safeAmount(inv.advancePayment);
        const s   = (inv.status || '').trim();
        if (s === 'Rejected' || s === 'Deleted') continue;
        total++;
        totalAmount += amt;
        if (s === 'Paid') {
            paidCount++;
            const pt = paidType(inv);
            // advance paid or final not received → count advance only
            paidAmt += (pt === 'advance' || pt === 'final_not') ? adv : amt;
        }
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

    const reason = await customPrompt('Enter reason for deletion (optional):', 'Delete Reason', '🗑️');

    showLoader();
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: CONFIG.ACTIONS.DELETE_INVOICE, invoiceNo, remark: reason || '' })
        });
        const result = await response.json();
        if (result.success) {
            const m = document.getElementById('statusUpdateModal');
            if (m) m.remove();
            clearCache();
            bgRefreshTimer = null;
            await loadInvoices();
            await customAlert('Invoice deleted successfully.', 'Deleted', '\uD83D\uDDD1\uFE0F');
        } else {
            customAlert('Error: ' + (result.error || 'Unknown'), 'Error', '\u2715');
        }
    } catch (e) {
        customAlert('Error deleting invoice.', 'Error', '✕');
    } finally {
        hideLoader();
    }
}

// Open status update modal
function openStatusModal(btn) {
    let invoice = {};
    try { invoice = JSON.parse(btn.dataset.invoice.replace(/&apos;/g, "'")); } catch(e) {}
    const invoiceNo     = invoice.invoiceNo     || '';
    const currentStatus = invoice.status        || '';
    const currentRemark = invoice.remark        || '';
    const pdfUrl        = invoice.pdfUrl        || '';
    const existing = document.getElementById('statusUpdateModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'statusUpdateModal';
    modal.className = 'invoice-modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="invoice-modal-content status-modal-content">
            <span class="close-invoice-modal" onclick="document.getElementById('statusUpdateModal').remove()">&times;</span>
            <h2>&#9999;&#65039; Update Invoice Status</h2>
            <p class="status-invoice-no">Invoice: <strong>#${invoiceNo}</strong></p>

            <div class="status-options">
                <button class="status-opt-btn ${currentStatus === 'Paid' ? 'active' : ''} paid" data-status="Paid"><i class="fas fa-check-circle"></i> Paid</button>
                <button class="status-opt-btn ${currentStatus === 'Pending' ? 'active' : ''} pending" data-status="Pending"><i class="fas fa-clock"></i> Pending</button>
                <button class="status-opt-btn ${currentStatus === 'Rejected' ? 'active' : ''} rejected" data-status="Rejected"><i class="fas fa-times-circle"></i> Rejected</button>
            </div>

            <div id="remarkSection" style="display:none;margin-top:18px">
                <label class="remark-label">Remark</label>
                <textarea id="statusRemark" class="status-remark-input" placeholder="Enter remark..." rows="3">${currentRemark}</textarea>
            </div>

            <div id="finalPaymentSection" style="display:none;margin-top:18px">
                <label class="remark-label">Payment Type</label>
                <div class="status-options" style="margin-top:8px">
                    <button class="fp-type-btn" data-fptype="advance"><i class="fas fa-hourglass-half"></i> Advance Paid</button>
                    <button class="fp-type-btn" data-fptype="final"><i class="fas fa-check-double"></i> Final Paid</button>
                </div>
                <div id="finalPaidSection" style="display:none;margin-top:14px">
                    <label class="remark-label">Final Payment Received?</label>
                    <div class="status-options" style="margin-top:8px">
                        <button class="fp-btn" data-fp="yes"><i class="fas fa-check"></i> Yes</button>
                        <button class="fp-btn" data-fp="no"><i class="fas fa-times"></i> No</button>
                    </div>
                    <div id="fpAccountSection" style="display:none;margin-top:14px">
                        <label class="remark-label">Same Account?</label>
                        <div class="status-options" style="margin-top:8px">
                            <button class="sa-btn" data-sa="yes"><i class="fas fa-check"></i> Yes</button>
                            <button class="sa-btn" data-sa="no"><i class="fas fa-times"></i> No</button>
                        </div>
                        <div id="fpFields" style="margin-top:14px"></div>
                    </div>
                </div>
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

    let selected = currentStatus;
    const remarkSection     = modal.querySelector('#remarkSection');
    const finalPaySection   = modal.querySelector('#finalPaymentSection');
    const finalPaidSection  = modal.querySelector('#finalPaidSection');
    const fpAccountSection  = modal.querySelector('#fpAccountSection');
    const fpFields          = modal.querySelector('#fpFields');

    if (selected === 'Pending' || selected === 'Rejected') remarkSection.style.display = 'block';
    if (selected === 'Paid') finalPaySection.style.display = 'block';

    modal.querySelectorAll('.status-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.status-opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selected = btn.dataset.status;
            remarkSection.style.display   = (selected === 'Pending' || selected === 'Rejected') ? 'block' : 'none';
            finalPaySection.style.display = (selected === 'Paid') ? 'block' : 'none';
            finalPaidSection.style.display = 'none';
            modal.querySelectorAll('.fp-type-btn').forEach(b => b.classList.remove('active'));
        });
    });

    // Advance Paid / Final Paid choice
    modal.querySelectorAll('.fp-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.fp-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            finalPaidSection.style.display = btn.dataset.fptype === 'final' ? 'block' : 'none';
            fpAccountSection.style.display = 'none';
            fpFields.innerHTML = '';
            modal.querySelectorAll('.fp-btn,.sa-btn').forEach(b => b.classList.remove('active'));
            const ex = modal.querySelector('#fpNoReasonDiv'); if (ex) ex.remove();
        });
    });

    // Final payment received yes/no
    modal.querySelectorAll('.fp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.fp-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fpAccountSection.style.display = btn.dataset.fp === 'yes' ? 'block' : 'none';
            fpFields.innerHTML = '';
            if (btn.dataset.fp === 'no') {
                const noReasonDiv = modal.querySelector('#fpNoReasonDiv') || document.createElement('div');
                noReasonDiv.id = 'fpNoReasonDiv';
                noReasonDiv.style.marginTop = '14px';
                noReasonDiv.innerHTML = `<label class="remark-label">Reason</label><textarea id="fpNoReason" class="status-remark-input" rows="2" placeholder="Enter reason for not receiving payment..."></textarea>`;
                fpAccountSection.parentNode.insertBefore(noReasonDiv, fpAccountSection);
            } else {
                const existing = modal.querySelector('#fpNoReasonDiv');
                if (existing) existing.remove();
            }
            modal.querySelectorAll('.sa-btn').forEach(b => b.classList.remove('active'));
        });
    });

    // Same account yes/no
    modal.querySelectorAll('.sa-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.sa-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const pm = invoice ? invoice.paymentMethod : '';
            if (btn.dataset.sa === 'yes') {
                // Pre-fill from existing invoice data
                if (pm === 'UPI') {
                    fpFields.innerHTML = `
                        <div class="fp-prefilled">
                            <p><span class="remark-label">UPI ID</span> ${invoice.upiId || ''}</p>
                            <p><span class="remark-label">Name</span> ${invoice.upiName || ''}</p>
                        </div>`;
                } else {
                    let bank = {};
                    try { bank = JSON.parse(invoice.bankDetails || '{}'); } catch(e) {}
                    fpFields.innerHTML = `
                        <div class="fp-prefilled">
                            <p><span class="remark-label">Account No</span> ${bank.accountNumber || ''}</p>
                            <p><span class="remark-label">IFSC</span> ${bank.ifscCode || ''}</p>
                            <p><span class="remark-label">Name</span> ${invoice.bankUserName || ''}</p>
                        </div>`;
                }
            } else {
                // Blank fields with method selector
                fpFields.innerHTML = `
                    <div class="form-group" style="margin-bottom:10px">
                        <label class="remark-label">Payment Method</label>
                        <select id="fpMethod" class="status-remark-input" style="padding:8px">
                            <option value="UPI">UPI</option>
                            <option value="AC">Bank</option>
                        </select>
                    </div>
                    <div id="fpUpiFields">
                        <div class="form-group" style="margin-bottom:8px">
                            <label class="remark-label">UPI ID</label>
                            <input id="fpUpiId" class="status-remark-input" style="padding:8px" placeholder="yourname@upi">
                        </div>
                        <div class="form-group">
                            <label class="remark-label">Name</label>
                            <input id="fpUpiName" class="status-remark-input" style="padding:8px" placeholder="Account Name">
                        </div>
                    </div>
                    <div id="fpBankFields" style="display:none">
                        <div class="form-group" style="margin-bottom:8px">
                            <label class="remark-label">Account Number</label>
                            <input id="fpAccNo" class="status-remark-input" style="padding:8px">
                        </div>
                        <div class="form-group" style="margin-bottom:8px">
                            <label class="remark-label">IFSC Code</label>
                            <input id="fpIfsc" class="status-remark-input" style="padding:8px">
                        </div>
                        <div class="form-group">
                            <label class="remark-label">Name</label>
                            <input id="fpBankName" class="status-remark-input" style="padding:8px">
                        </div>
                    </div>`;
                const fpMethod = fpFields.querySelector('#fpMethod');
                fpMethod.addEventListener('change', () => {
                    fpFields.querySelector('#fpUpiFields').style.display  = fpMethod.value === 'UPI' ? 'block' : 'none';
                    fpFields.querySelector('#fpBankFields').style.display = fpMethod.value === 'AC'  ? 'block' : 'none';
                });
            }
        });
    });

    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

async function submitStatusUpdate(invoiceNo) {
    const modal     = document.getElementById('statusUpdateModal');
    const activeBtn = modal.querySelector('.status-opt-btn.active');
    if (!activeBtn) { customAlert('Please select a status.', 'Warning', '\u26a0\ufe0f'); return; }

    const status = activeBtn.dataset.status;
    let finalPayment = '';
    let remark = modal.querySelector('#statusRemark')?.value.trim() || '';

    if (status === 'Paid') {
        const fpTypeBtn = modal.querySelector('.fp-type-btn.active');
        const fpType = fpTypeBtn ? fpTypeBtn.dataset.fptype : null;

        if (fpType === 'advance') {
            finalPayment = '';
            remark = '';
        } else if (fpType === 'final') {
            const fpActive = modal.querySelector('.fp-btn.active');
            if (fpActive && fpActive.dataset.fp === 'no') {
                const noReason = modal.querySelector('#fpNoReason')?.value.trim() || '';
                remark = noReason ? 'NOT_RECEIVED: ' + noReason : 'NOT_RECEIVED';
                finalPayment = ''; 
            } else if (fpActive && fpActive.dataset.fp === 'yes') {
                remark = '';
                const saYes = modal.querySelector('.sa-btn.active');
                if (saYes) {
                    if (saYes.dataset.sa === 'yes') {
                        finalPayment = 'same_account';
                    } else {
                        const fpMethod = modal.querySelector('#fpMethod');
                        if (fpMethod && fpMethod.value === 'UPI') {
                            const id   = modal.querySelector('#fpUpiId')?.value.trim()  || '';
                            const name = modal.querySelector('#fpUpiName')?.value.trim() || '';
                            finalPayment = `UPI: ${id}, NAME: ${name}`;
                        } else if (fpMethod) {
                            const acc  = modal.querySelector('#fpAccNo')?.value.trim()    || '';
                            const ifsc = modal.querySelector('#fpIfsc')?.value.trim()     || '';
                            const name = modal.querySelector('#fpBankName')?.value.trim() || '';
                            finalPayment = `AC: ${acc}, IFSC: ${ifsc}, NAME: ${name}`;
                        }
                    }
                }
            }
        }
    }

    showLoader();
    modal.remove();
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: CONFIG.ACTIONS.UPDATE_STATUS, invoiceNo, status, remark, finalPayment })
        });
        const result = await response.json();
        if (result.success) {
            clearCache();
            bgRefreshTimer = null; // reset so startBgRefresh restarts cleanly
            await loadInvoices();
            await customAlert('Status updated successfully!', 'Updated', '\u2705');
        } else {
            hideLoader();
            customAlert('Error: ' + result.error, 'Error', '\u2715');
        }
    } catch (e) {
        hideLoader();
        customAlert('Error updating status.', 'Error', '\u2715');
    }
}

// customAlert is provided by utils.js which is loaded before this script
