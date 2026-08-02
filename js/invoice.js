// Page Protection + Init — script is at bottom of body so DOM is ready
(function () {
    const user = JSON.parse(localStorage.getItem('user'));
    if (window.location.pathname.includes('invoice.html')) {
        if (!user || !user.role || user.role.toLowerCase() !== 'admin') {
            window.location.href = '../index.html';
            return;
        }
    }
    if (user && user.role && user.role.toLowerCase() === 'admin') {
        document.body.classList.add('admin-view');
    }
    initInvoicePage();
}());

function initInvoicePage() {
    const invoiceForm          = document.getElementById('invoiceForm');
    const itemsBody            = document.getElementById('itemsBody');
    const paymentMethodSelect  = document.getElementById('paymentMethod');
    const bankDetails          = document.getElementById('bankDetails');
    const upiDetails           = document.getElementById('upiDetails');
    const viewInvoicesBtn      = document.getElementById('viewInvoicesBtn');
    const invoiceListModal     = document.getElementById('invoiceListModal');
    const closeInvoiceModal    = document.querySelector('.close-invoice-modal');
    const invoiceListContainer = document.getElementById('invoiceListContainer');

    if (!invoiceForm) return;

    // ---- Cache helpers (shared key with invoice-list.js) ----
    const CACHE_KEY = 'bm_invoices_cache';

    function saveCache(invoices) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), invoices }));
    }
    function loadCache() {
        try {
            const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
            if (c && Array.isArray(c.invoices)) return c.invoices;
        } catch(e) {}
        return null;
    }
    function clearCache() { localStorage.removeItem(CACHE_KEY); }


    // ---- Payment method toggle ----
    paymentMethodSelect.addEventListener('change', (e) => {
        const v = e.target.value;
        bankDetails.style.display = (v === 'bank') ? 'block' : 'none';
        upiDetails.style.display  = (v === 'upi')  ? 'block' : 'none';
    });

    // ---- Add item row ----
    window.addItem = function () {
        const rowCount = itemsBody.querySelectorAll('.item-row').length + 1;
        const newRow = document.createElement('tr');
        newRow.className = 'item-row';
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td><input type="text" class="item-desc" placeholder="Item description" required></td>
            <td><input type="number" class="item-qty" value="1" min="1" required></td>
            <td><input type="number" class="item-amount" placeholder="0" step="100" required></td>
            <td><button type="button" class="remove-item" onclick="removeItem(this)">Remove</button></td>
        `;
        itemsBody.appendChild(newRow);
        newRow.querySelectorAll('input').forEach(input => input.addEventListener('input', calculateTotals));
        updateRowNumbers();
    };

    // ---- Remove item row ----
    window.removeItem = async function (button) {
        if (itemsBody.querySelectorAll('.item-row').length > 1) {
            button.closest('.item-row').remove();
            updateRowNumbers();
            calculateTotals();
        } else {
            await customAlert('At least one item is required!', 'Warning', '⚠️');
        }
    };

    function updateRowNumbers() {
        itemsBody.querySelectorAll('.item-row').forEach((row, i) => {
            row.querySelector('td:first-child').textContent = i + 1;
        });
    }

    // ---- Calculate totals ----
    function calculateTotals() {
        let subTotal = 0;
        itemsBody.querySelectorAll('.item-row').forEach(row => {
            const qty    = parseFloat(row.querySelector('.item-qty').value)    || 0;
            const amount = parseFloat(row.querySelector('.item-amount').value) || 0;
            subTotal += qty * amount;
        });
        const advance    = parseFloat(document.getElementById('advancePayment').value) || 0;
        const balanceDue = subTotal - advance;
        document.getElementById('subTotal').textContent   = subTotal.toFixed(2);
        document.getElementById('total').textContent      = subTotal.toFixed(2);
        document.getElementById('balanceDue').textContent = balanceDue.toFixed(2);
        document.getElementById('totalWords').textContent = numberToWords(subTotal);
    }
    window.calculateTotals = calculateTotals;

    document.querySelectorAll('.item-qty, .item-amount').forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
    document.getElementById('advancePayment').addEventListener('input', calculateTotals);

    // ---- Number to words ----
    function numberToWords(num) {
        if (num === 0) return 'Zero Rupees Only';
        const ones  = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
        const tens  = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
        const teens = ['Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
        function lt1000(n) {
            if (n === 0) return '';
            if (n < 10)  return ones[n];
            if (n < 20)  return teens[n - 10];
            if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' '+ones[n%10] : '');
            return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' '+lt1000(n%100) : '');
        }
        const crore    = Math.floor(num / 10000000);
        const lakh     = Math.floor((num % 10000000) / 100000);
        const thousand = Math.floor((num % 100000) / 1000);
        const rem      = Math.floor(num % 1000);
        let result = '';
        if (crore)    result += lt1000(crore)    + ' Crore ';
        if (lakh)     result += lt1000(lakh)     + ' Lakh ';
        if (thousand) result += lt1000(thousand) + ' Thousand ';
        if (rem)      result += lt1000(rem);
        return result.trim() + ' Rupees Only';
    }

    // ---- Defaults ----
    document.getElementById('invoiceDate').valueAsDate = new Date();
    const due = new Date(); due.setDate(due.getDate() + 30);
    document.getElementById('dueDate').valueAsDate = due;
    document.getElementById('invoiceNo').value = generateInvoiceNumber();

    function generateInvoiceNumber() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const r = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INV-${y}${m}-${r}`;
    }

    function validatePhone(val) {
        return /^(?:\+91|0)?[6-9]\d{9}$/.test(val.trim().replace(/\s+/g, ''));
    }

    // ---- Form submit ----
    invoiceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const fromPhone = document.getElementById('fromPhone').value;
        const toPhone   = document.getElementById('toPhone').value;
        if (!validatePhone(fromPhone)) {
            await customAlert('Enter a valid 10-digit mobile number for "From" (e.g. 9876543210 or +91 9876543210).', 'Invalid Mobile', '📵');
            document.getElementById('fromPhone').focus();
            return;
        }
        if (!validatePhone(toPhone)) {
            await customAlert('Enter a valid 10-digit mobile number for "Bill To" (e.g. 9876543210 or +91 9876543210).', 'Invalid Mobile', '📵');
            document.getElementById('toPhone').focus();
            return;
        }

        // ---- Advance payment 30% validation ----
        const subTotalVal = parseFloat(document.getElementById('subTotal').textContent) || 0;
        const advanceVal  = parseFloat(document.getElementById('advancePayment').value) || 0;
        const minAdvance  = Math.ceil(subTotalVal * 0.30);
        if (subTotalVal > 0 && advanceVal < minAdvance) {
            const advEl = document.getElementById('advancePayment');
            advEl.style.borderColor = '#e94560';
            advEl.style.boxShadow   = '0 0 10px rgba(233,69,96,0.5)';
            setTimeout(() => { advEl.style.borderColor = ''; advEl.style.boxShadow = ''; }, 3000);
            await customAlert(`Minimum advance payment is ₹${minAdvance} (30% of ₹${subTotalVal.toFixed(2)}).`, 'Advance Required', '⚠️');
            advEl.focus();
            return;
        }

        const items = [];
        itemsBody.querySelectorAll('.item-row').forEach((row, i) => {
            items.push({
                slNo: i + 1,
                description: row.querySelector('.item-desc').value,
                qty:    row.querySelector('.item-qty').value,
                amount: row.querySelector('.item-amount').value
            });
        });

        const paymentMethod  = document.getElementById('paymentMethod').value;
        const paymentDetails = {};

        if (paymentMethod === 'bank') {
            paymentDetails.bank = {
                accountHolder: document.getElementById('accountHolder').value,
                bankName:      document.getElementById('bankName').value,
                accountNumber: document.getElementById('accountNumber').value,
                accountType:   document.getElementById('accountType').value,
                ifscCode:      document.getElementById('ifscCode').value,
                branch:        document.getElementById('branch').value,
                swiftCode:     document.getElementById('swiftCode').value
            };
        }
        if (paymentMethod === 'upi') {
            paymentDetails.upi = {
                upiId: document.getElementById('upiId').value,
                name:  document.getElementById('upiName').value
            };
        }

        const invoiceData = {
            action:      CONFIG.ACTIONS.INVOICE,
            invoiceNo:   document.getElementById('invoiceNo').value,
            from: {
                name:    document.getElementById('fromName').value,
                phone:   document.getElementById('fromPhone').value,
                email:   document.getElementById('fromEmail').value,
                address: document.getElementById('fromAddress').value
            },
            to: {
                name:    document.getElementById('toName').value,
                phone:   document.getElementById('toPhone').value,
                email:   document.getElementById('toEmail').value,
                address: document.getElementById('toAddress').value
            },
            invoiceDate:      document.getElementById('invoiceDate').value,
            terms:            document.getElementById('terms').value,
            dueDate:          document.getElementById('dueDate').value,
            items,
            subTotal:         document.getElementById('subTotal').textContent,
            total:            document.getElementById('total').textContent,
            advancePayment:   document.getElementById('advancePayment').value,
            balanceDue:       document.getElementById('balanceDue').textContent,
            totalWords:       document.getElementById('totalWords').textContent,
            paymentMethod,
            paymentDetails,
            termsConditions:  document.getElementById('termsConditions').value
        };

        // QR code for UPI
        if (paymentDetails.upi && paymentDetails.upi.upiId) {
            const upiString = `upi://pay?pa=${paymentDetails.upi.upiId}&pn=${paymentDetails.upi.name || 'Bluemoon Production'}&am=${invoiceData.advancePayment}&cu=INR&tn=Invoice ${invoiceData.invoiceNo}`;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
            try {
                const qrResp = await fetch(qrUrl);
                const blob   = await qrResp.blob();
                await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => { invoiceData.qrCodeBase64 = reader.result; resolve(); };
                    reader.readAsDataURL(blob);
                });
            } catch (err) {
                console.log('QR generation failed:', err);
            }
        }

        try {
            showInvoiceLoading(true, 'Generating invoice...');
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(invoiceData)
            });
            const result = await response.json();
            showInvoiceLoading(false);

            if (result.success) {
                clearCache();
                await customAlert(
                    `Invoice generated successfully!<br><strong>Invoice No:</strong> ${invoiceData.invoiceNo}<br>PDF saved to Google Drive.`,
                    'Success', '✓', result.pdfUrl || null,
                    { toName: invoiceData.to.name, invoiceNo: invoiceData.invoiceNo, pdfUrl: result.pdfUrl || '' }
                );
                invoiceForm.reset();
                calculateTotals();
                document.getElementById('invoiceNo').value = generateInvoiceNumber();
                document.getElementById('invoiceDate').valueAsDate = new Date();
                const d2 = new Date(); d2.setDate(d2.getDate() + 30);
                document.getElementById('dueDate').valueAsDate = d2;
            } else {
                await customAlert('Error generating invoice: ' + (result.error || 'Unknown error'), 'Error', '✕');
            }
        } catch (error) {
            showInvoiceLoading(false);
            console.error('Error:', error);
            await customAlert(
                `Invoice generated successfully!<br><strong>Invoice No:</strong> ${invoiceData.invoiceNo}<br>PDF will be saved to Google Drive.`,
                'Success', '✓', null
            );
            invoiceForm.reset();
            calculateTotals();
            document.getElementById('invoiceNo').value = generateInvoiceNumber();
        }
    });

    // ---- Loading overlay ----
    function showInvoiceLoading(show, message = 'Processing...') {
        let el = document.querySelector('.invoice-loading');
        if (!el) {
            el = document.createElement('div');
            el.className = 'invoice-loading';
            el.innerHTML = `<div class="loading-content"><div class="spinner"></div><p></p></div>`;
            document.body.appendChild(el);
        }
        if (show) { el.classList.add('show'); el.querySelector('p').textContent = message; }
        else       { el.classList.remove('show'); }
    }

    // ---- Invoice list modal ----
    if (viewInvoicesBtn) {
        viewInvoicesBtn.addEventListener('click', async () => {
            await loadInvoiceList();
            invoiceListModal.style.display = 'block';
        });
    }

    if (closeInvoiceModal) {
        closeInvoiceModal.addEventListener('click', () => {
            invoiceListModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === invoiceListModal) invoiceListModal.style.display = 'none';
    });

    function renderInvoiceListItems(invoices) {
        const statusColor = s => s === 'Paid' ? '#28a745' : s === 'Rejected' ? '#e94560' : '#ffc107';
        // hide final paid and final not paid — only show editable invoices
        const editable = invoices.filter(inv => {
            if (inv.status !== 'Paid') return true;
            const fp = (inv.finalPayment || '').trim();
            const rm = (inv.remark || '').trim();
            return !fp && !rm; // advance paid only
        });
        if (!editable.length) {
            invoiceListContainer.innerHTML = '<p style="text-align:center;color:#666">No editable invoices.</p>';
            return;
        }
        invoiceListContainer.innerHTML = editable.map(inv => `
            <div class="invoice-item">
                <div class="invoice-info">
                    <h3>#${inv.invoiceNo}</h3>
                    <p><i class="fas fa-user"></i> ${inv.customerName}</p>
                    <p><i class="fas fa-phone"></i> ${inv.customerPhone || ''}</p>
                    <p><i class="fas fa-calendar"></i> ${new Date(inv.timestamp).toLocaleDateString()}</p>
                    <p><i class="fas fa-tag"></i> <span style="color:${statusColor(inv.status)}">${inv.status}</span></p>
                    <p class="inv-amt">₹${(inv.advancePayment||0).toLocaleString('en-IN')} / ₹${(inv.totalAmount||0).toLocaleString('en-IN')}</p>
                </div>
                <div class="invoice-actions">
                    <button class="inv-btn inv-preview" onclick="previewInvoice('${inv.pdfUrl}')"><i class="fas fa-eye"></i><span>Preview</span></button>
                    <button class="inv-btn inv-share"   onclick="shareInvoiceItem('${inv.pdfUrl}','${inv.invoiceNo}','${inv.customerName}')"><i class="fas fa-share-alt"></i><span>Share</span></button>
                    <button class="inv-btn inv-update"  onclick="editInvoice('${inv.invoiceNo}')"><i class="fas fa-pen"></i><span>Edit</span></button>
                </div>
            </div>
        `).join('');
    }

    async function loadInvoiceList() {
        const cached = loadCache();
        if (cached) { renderInvoiceListItems(cached); return; }
        invoiceListContainer.innerHTML = '<div style="text-align:center;padding:30px"><div class="list-spinner" style="margin:0 auto"></div></div>';
        try {
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: CONFIG.ACTIONS.GET_INVOICES })
            });
            const result = await response.json();
            if (result.success && result.invoices.length > 0) {
                saveCache(result.invoices);
                renderInvoiceListItems(result.invoices);
            } else {
                invoiceListContainer.innerHTML = '<p style="text-align:center;color:#666">No invoices found.</p>';
            }
        } catch (err) {
            invoiceListContainer.innerHTML = '<p style="text-align:center;color:#e94560">Error loading invoices.</p>';
        }
    }

    window.previewInvoice = async function (pdfUrl) {
        if (!pdfUrl || pdfUrl.includes('Error')) {
            await customAlert('PDF not available.', 'Not Available', 'ℹ️'); return;
        }
        let fileId = '';
        if (pdfUrl.includes('/d/'))  fileId = pdfUrl.split('/d/')[1].split('/')[0];
        else if (pdfUrl.includes('id=')) fileId = pdfUrl.split('id=')[1].split('&')[0];
        const previewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : pdfUrl;
        const modal = document.createElement('div');
        modal.className = 'invoice-modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="invoice-modal-content" style="height:85vh">
                <span class="close-invoice-modal" onclick="this.closest('.invoice-modal').remove()">&times;</span>
                <h2>Invoice Preview</h2>
                <iframe src="${previewUrl}" style="width:100%;height:calc(100% - 100px);border:none;border-radius:5px;margin-top:20px" allow="autoplay"></iframe>
            </div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    };

    window.shareInvoice = async function (pdfUrl, invoiceNo) {
        if (!pdfUrl || pdfUrl.includes('Error')) {
            await customAlert('PDF not available.', 'Not Available', 'ℹ️'); return;
        }
        let fileId = '';
        if (pdfUrl.includes('/d/'))  fileId = pdfUrl.split('/d/')[1].split('/')[0];
        else if (pdfUrl.includes('id=')) fileId = pdfUrl.split('id=')[1].split('&')[0];
        const link = fileId ? `https://drive.google.com/file/d/${fileId}/view` : pdfUrl;
        const text = `Invoice ${invoiceNo}\n${link}`;
        navigator.clipboard.writeText(text)
            .then(async () => await customAlert('Link copied!', 'Copied', '📋'))
            .catch(() => prompt('Copy this link:', link));
    };

    window.shareInvoiceItem = async function (pdfUrl, invoiceNo, customerName) {
        if (!pdfUrl || pdfUrl.includes('Error')) {
            await customAlert('PDF not available.', 'Not Available', 'ℹ️'); return;
        }
        let fileId = '';
        if (pdfUrl.includes('/d/'))  fileId = pdfUrl.split('/d/')[1].split('/')[0];
        else if (pdfUrl.includes('id=')) fileId = pdfUrl.split('id=')[1].split('&')[0];
        const link = fileId ? `https://drive.google.com/file/d/${fileId}/view` : pdfUrl;
        const text = `Hii ${customerName},\nPlease find the invoice here: ${invoiceNo}\n${link}`;
        navigator.clipboard.writeText(text)
            .then(async () => await customAlert('Link copied!', 'Copied', '📋'))
            .catch(() => prompt('Copy this link:', link));
    };

    window.editInvoice = async function (invoiceNo) {
        try {
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: CONFIG.ACTIONS.GET_INVOICE_DETAILS, invoiceNo })
            });
            const result = await response.json();
            if (result.success) {
                const inv = result.invoice;
                document.getElementById('invoiceNo').value       = inv.invoiceNo;
                document.getElementById('toName').value          = inv.customerName;
                document.getElementById('toEmail').value         = inv.customerEmail;
                document.getElementById('toPhone').value         = inv.customerPhone;
                document.getElementById('invoiceDate').value     = inv.invoiceDate;
                document.getElementById('dueDate').value         = inv.dueDate;
                document.getElementById('terms').value           = inv.terms || '';
                document.getElementById('advancePayment').value  = inv.advancePayment;
                document.getElementById('paymentMethod').value   = inv.paymentMethod;
                if (inv.upiId) document.getElementById('upiId').value = inv.upiId;
                invoiceListModal.style.display = 'none';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                await customAlert('Invoice loaded for editing.<br>This will create a new invoice when submitted.', 'Invoice Loaded', 'ℹ️');
            } else {
                await customAlert('Error: ' + result.error, 'Error', '✕');
            }
        } catch (err) {
            await customAlert('Error loading invoice details.', 'Error', '✕');
        }
    };
}
