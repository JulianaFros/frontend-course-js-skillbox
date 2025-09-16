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
    function syncRate() {
        if (range && rateOut)
            rateOut.textContent = range.value;
    }
    if (range) {
        range.addEventListener('input', syncRate);
        syncRate();
    }

    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');

    function setError(input, msg, errNode) {
        if (!input) return;
        if (msg) {
            input.setAttribute('aria-invalid', true);
            if (errNode) errNode.textContent = msg;
        } else {
            input.removeAttribute('aria-invalid');
            if (errNode) errNode.textContent = '';
        }
    }

    function validateName() {
        const el = document.getElementById('name');
        const val = (el?.value || '').trim();
        let msg = '';
        if (!val) msg = 'Введите имя';
        else if (val.length < 2) msg = 'Имя слишком короткое (минимум 2 символа)';
        setError(el, msg, errName);
        return !msg;
    }

    function validateEmail() {
        const el = document.getElementById('email');
        const val = (el?.value || '').trim();
        let msg = '';
        if (!val) msg = 'Укажите email';
        else if (el && !el.checkValidity()) msg = 'Неверный формат email';
        setError(el, msg, errEmail);
        return !msg;
    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    if (nameInput) nameInput.addEventListener('input', validateName);
    if (emailInput) emailInput.addEventListener('input', validateEmail);


    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const ok = [validateName(), validateEmail()].every(Boolean);
        if (!ok) return;

        const fd = new FormData(form);

        if (!form.reportValidity())
            return;

        const nameValue = (fd.get('name') || '').toString().trim();
        const emailValue = (fd.get('email') || '').toString().trim();
        const genderValue = (fd.get('gender') || '—').toString();
        const rateValue = (fd.get('rate') || '—').toString();
        const commentVal = (fd.get('comment') || '').toString().trim();
        const interestsArr = fd.getAll('interests');


        out.name.textContent = nameValue || '—';
        out.email.textContent = emailValue || '—';
        out.gender.textContent = genderValue;
        out.rate.textContent = rateValue;
        out.interests.textContent = interestsArr.length ? interestsArr.join(', ') : '-';
        out.comment.textContent = commentVal || '—';

        box.hidden = false;
        form.reset();
        syncRate();
    });
});