document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('order-form');
    const box = document.getElementById('results');


    const out = {
        name: document.getElementById('r-name'),
        email: document.getElementById('r-email'),
        gender: document.getElementById('r-gender'),
        rate: document.getElementById('r-rate'),
        interests: document.getElementById('r-interests'),
        comment: document.getElementById('r-comment'),
    };

    const range = document.getElementById('range');
    const rateOut = document.getElementById('rateOut');
    if (range && rateOut) {
        function syncRate() {
            rateOut.textContent = range.value;
        }
        range.addEventListener('input', syncRate);
        syncRate();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const fd = new FormData(form);

        const nameValue = (fd.get('name') || '').toString().trim();
        const emailValue = (fd.get('email') || '').toString().trim();
        const genderValue = (fd.get('gender') || '—').toString();
        const rateValue = (fd.get('rate') || '—').toString();
        const commentVal = (fd.get('comment') || '').toString().trim();
        const interests = fd.getAll('interests');


        out.name.textContent = nameValue || '—';
        out.email.textContent = emailValue || '—';
        out.gender.textContent = genderValue;
        out.rate.textContent = rateValue;
        out.interests.textContent = interests.length ? interests.join(', ') : '-';
        out.comment.textContent   = commentVal || '—';

        box.hidden = false;
        form.reset();
    });
});