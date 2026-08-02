// Custom Alert and Confirm Functions
function customAlert(message, title = 'Notification', icon = '✓', pdfUrl = null, shareData = null) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';

        const previewButton = pdfUrl
            ? `<button class="custom-modal-btn custom-modal-btn-secondary" id="_previewBtn">👁️ Preview Invoice</button>`
            : '';

        const shareButton = shareData
            ? `<button class="custom-modal-btn custom-modal-btn-secondary" id="_shareBtn">📤 Share Invoice</button>`
            : '';

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
                    ${previewButton}
                    ${shareButton}
                    <button class="custom-modal-btn custom-modal-btn-primary" id="_okBtn">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';

        modal.querySelector('#_okBtn').addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });

        if (pdfUrl) {
            modal.querySelector('#_previewBtn').addEventListener('click', () => {
                let fileId = '';
                if (pdfUrl.includes('/d/'))  fileId = pdfUrl.split('/d/')[1].split('/')[0];
                else if (pdfUrl.includes('id=')) fileId = pdfUrl.split('id=')[1].split('&')[0];
                const previewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : pdfUrl;
                window.open(previewUrl, '_blank');
            });
        }

        if (shareData) {
            modal.querySelector('#_shareBtn').addEventListener('click', () => {
                let fileId = '';
                if (shareData.pdfUrl.includes('/d/'))  fileId = shareData.pdfUrl.split('/d/')[1].split('/')[0];
                else if (shareData.pdfUrl.includes('id=')) fileId = shareData.pdfUrl.split('id=')[1].split('&')[0];
                const link = fileId ? `https://drive.google.com/file/d/${fileId}/view` : shareData.pdfUrl;
                const text = `Hii ${shareData.toName},\nPlease find the invoice here: ${shareData.invoiceNo}\n${link}`;
                navigator.clipboard.writeText(text).then(() => {
                    const btn = modal.querySelector('#_shareBtn');
                    btn.textContent = '✅ Copied!';
                    setTimeout(() => { btn.innerHTML = '📤 Share Invoice'; }, 2000);
                });
            });
        }
    });
}

function customPrompt(message, title = 'Input', icon = '✏️') {
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
                    <textarea class="prompt-input" rows="2" placeholder="Type here..."></textarea>
                </div>
                <div class="custom-modal-footer">
                    <button class="custom-modal-btn custom-modal-btn-secondary skip-btn">Skip</button>
                    <button class="custom-modal-btn custom-modal-btn-primary submit-btn">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
        modal.querySelector('.submit-btn').addEventListener('click', () => {
            const val = modal.querySelector('.prompt-input').value.trim();
            modal.remove();
            resolve(val);
        });
        modal.querySelector('.skip-btn').addEventListener('click', () => {
            modal.remove();
            resolve('');
        });
    });
}

function customConfirm(message, title = 'Confirm', icon = '❓') {
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
                    <button class="custom-modal-btn custom-modal-btn-secondary cancel-btn">Cancel</button>
                    <button class="custom-modal-btn custom-modal-btn-primary confirm-btn">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
            resolve(false);
        });
    });
}
