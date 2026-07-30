// Custom Alert and Confirm Functions
function customAlert(message, title = 'Notification', icon = '✓', pdfUrl = null) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';

        const previewButton = pdfUrl
            ? `<button class="custom-modal-btn custom-modal-btn-secondary" id="_previewBtn">👁️ Preview Invoice</button>`
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
