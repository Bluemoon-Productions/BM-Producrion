document.addEventListener('DOMContentLoaded', () => {
    const services = [
        "Video Production",
        "Music Production",
        "Mixing & Mastering",
        "Graphic Designing",
        "Audio Visualizer",
        "Cover Arts",
        "Video Editing",
        "Reel Editing",
        "PR & Marketing"
    ];

    VirtualSelect.init({
        ele: '#services-multiselect',
        options: services.map(s => ({ label: s, value: s })),
        multiple: true,
        placeholder: "Select services",
        search: true,
        allowNewOption: true,
    });

    const form = document.getElementById('firstEmailForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner show"></div>';

        const servicesSelect = document.querySelector('#services-multiselect');

        const formData = {
            action: 'sendFirstEmail',
            clientName: document.getElementById('clientName').value,
            stageName: document.getElementById('stageName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            instagram: document.getElementById('instagram').value,
            services: servicesSelect.value.join(', '),
            additionalMessage: document.getElementById('additionalMessage').value
        };

        try {
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                await customAlert('Email sent and data saved successfully!', 'Success', '✓');
                form.reset();
                servicesSelect.reset();
            } else {
                throw new Error(result.error || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error:', error);
            await customAlert(error.message, 'Error', '✕');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Email';
        }
    });
});
