$(document).ready(function () {
  // do stuff

  // setting the active menu
  toggleMenuState();

  // setting up dark mode during load time
  const mode = localStorage.getItem('mode');
  const body = document.querySelector('body');
  const dtoggle = document.querySelector('#darkmodeSwitch');

  if (mode) {
    body.classList.toggle('dark-mode');

    if (dtoggle) {
      dtoggle.checked = true;
    }
  }

  $('#loader').fadeOut(1000);

  $('.headerButton.goBack').on('click', goBack);

  $('#view_password').on('click', showPassword);

  $('.sclose').on('click', () => window.location.reload());

  $('.rclose').on('click', () => window.location.reload());

  // for toggling dark mode
  $('#darkmodeSwitch').on('click', () => {
    const body = document.querySelector('body');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('mode', 'dark');
      return;
    }

    localStorage.removeItem('mode');
  });

  $('.scopy').on('click', async () => {
    const paytag = document.querySelector('#newpaytag');

    // paytag.select();
    // paytag.setSelectionRange(0, 99999);

    await navigator.clipboard.writeText(paytag.value);

    window.location.reload();
  });

  $('#copyamount').on('click', async () => {
    const paytag = document.querySelector('#cryptoamount');

    // paytag.select();
    // paytag.setSelectionRange(0, 99999);

    await navigator.clipboard.writeText(paytag.value);
  });

  $('#copyaddress').on('click', async () => {
    const paytag = document.querySelector('#cryptoaddress');

    // paytag.select();
    // paytag.setSelectionRange(0, 99999);

    await navigator.clipboard.writeText(paytag.value);
  });

  // handling submission of send money form
  $('.send').on('submit', async function (e) {
    e.preventDefault();
    const amount = document.querySelector('#samount').value;
    const pin = document.querySelector('#spin').value;
    const paytag = document.querySelector('#newpaytag');
    console.log(amount, pin);
    const data = { amount: amount, pin: pin };

    var url = '/tag/generate';

    const req = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await req.json();

    console.log(res);

    if (res.status === true) {
      document.querySelector('.smsg').textContent = res.message;
      paytag.value = res.data.tag;
      paytag.setAttribute('disabled', 'true');
      closeModal();
      toggleDialog('#sfmodal');
    } else {
      document.querySelector('.fmsg').textContent = res.error;
      closeModal();
      toggleDialog('#fmodal');
    }
  });

  // handling submission of redeem paytag form
  $('.redeem').on('submit', async function (e) {
    e.preventDefault();
    const paytag = document.querySelector('#rpaytag').value;
    const pin = document.querySelector('#rpin').value;

    const data = { paytag, pin };

    var url = '/tag/redeem';

    const req = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await req.json();

    console.log(res);

    if (res.status === true) {
      document.querySelector('.rmsg').textContent = res.message;
      closeModal();
      toggleDialog('#smodal');
    } else {
      document.querySelector('.fmsg').textContent = res.error;
      closeModal();
      toggleDialog('#fmodal');
    }
  });

  // handling submission of deposit money form
  $('.deposit').on('submit', async function (e) {
    e.preventDefault();
    const amount = document.querySelector('#damount').value;
    const methodEl = document.querySelector('#dmethod');

    const method = methodEl.options[methodEl.selectedIndex].value;

    if (method === 'crypto') {
      const data = { amount };

      console.log(data);

      var url = '/hidden/buycoins/';

      const req = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const res = await req.json();

      console.log(res);

      if (res.status === true) {
        document.querySelector('#rate').textContent = res.data.rate;
        document.querySelector('#cryptoamount').value = res.data.cryptoAmount;
        document.querySelector('#cryptoaddress').value = res.data.address;
        closeModal();
        toggleDialog('#dsmodal');
      } else {
        document.querySelector('.fmsg').textContent = res.error;
        closeModal();
        toggleDialog('#fmodal');
      }
    }
  });
});

function showPassword() {
  var open = $('#view_password').hasClass('open');
  if (!open) {
    $('#view_password').html('<ion-icon name="eye-outline"></ion-icon>');

    $('#password1').attr({ type: 'text' });

    $('#view_password').addClass('open');
  } else {
    $('#view_password').html('<ion-icon name="eye-off-outline"></ion-icon>');
    $('#password1').attr({ type: 'password' });

    $('#view_password').removeClass('open');
  }
}

function toggleDialog(name) {
  document.querySelector(name).click();
}

function closeModal() {
  $('.modal.fade.action-sheet.show').click();
  return;
}

function goBack() {
  window.history.back();
}

function toggleMenuState() {
  var find = window.location.href.split('/');
  console.log(find);
  var finder = find[find.length - 1];

  if (finder.length < 2) {
    finder = find[find.length - 2];

    if (finder.includes('paytagz') || finder.includes('localhost')) {
      return;
    }

    const menu = document.querySelector('.appBottomMenu');

    if (menu) {
      document.querySelector('#' + finder).classList.toggle('active');
    }
  } else {
    const menu = document.querySelector('.appBottomMenu');

    if (menu) {
      document.querySelector('#' + finder).classList.toggle('active');
    }
  }
}
