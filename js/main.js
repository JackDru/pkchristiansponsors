// PK Christian Sponsors — shared site behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Donation amount picker (donate page)
  var amountOptions = document.querySelectorAll('.amount-option');
  amountOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      amountOptions.forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      var customInput = document.querySelector('#customAmount');
      if (customInput && opt.dataset.amount !== 'custom') {
        customInput.value = '';
      }
    });
  });

  // One-time / Monthly toggle (donate page)
  var toggleBtns = document.querySelectorAll('.toggle-group button');
  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      toggleBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  // Pre-fill donation amount/summary from a sponsorship builder handoff
  // (sponsor.html links here as donate.html?monthly=1&amount=18&items=...)
  var params = new URLSearchParams(window.location.search);
  if (params.has('amount')) {
    var amount = params.get('amount');
    var itemsParam = params.get('items');

    if (params.get('monthly') === '1') {
      var monthlyBtn = document.querySelectorAll('.toggle-group button')[1];
      if (monthlyBtn) {
        toggleBtns.forEach(function (b) { b.classList.remove('active'); });
        monthlyBtn.classList.add('active');
      }
    }

    var matchedOption = document.querySelector('.amount-option[data-amount="' + amount + '"]');
    amountOptions.forEach(function (o) { o.classList.remove('selected'); });
    var customInput = document.querySelector('#customAmount');
    if (matchedOption) {
      matchedOption.classList.add('selected');
    } else {
      var customOption = document.querySelector('.amount-option[data-amount="custom"]');
      if (customOption) customOption.classList.add('selected');
      if (customInput) customInput.value = amount;
    }

    if (itemsParam) {
      var summary = document.getElementById('orderSummary');
      if (summary) {
        summary.hidden = false;
        summary.querySelector('.order-summary-items').textContent = decodeURIComponent(itemsParam);
        summary.querySelector('.order-summary-total').textContent = '$' + amount + '/mo';
      }
    }
  }

  // Placeholder form submit handling — no backend wired up yet
  var forms = document.querySelectorAll('form[data-placeholder-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-success');
      if (note) {
        note.style.display = 'block';
      } else {
        alert('Thank you! This form is a placeholder — connect it to your email/CRM or a form service (e.g. Formspree, Mailchimp) to go live.');
      }
      form.reset();
    });
  });
});
