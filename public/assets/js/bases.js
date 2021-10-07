$(document).ready(function () {
  // do stuff
  $('#loader').fadeOut(1000);

  $('.headerButton.goBack').on('click', goBack);

  $('#view_password').on('click', showPassword);

  $('.send').on('submit', async function (e) {
    e.preventDefault();
    const amount = document.querySelector('#samount').value;
    const pin = document.querySelector('#spin').value;
    const paytag = document.querySelector('#newpaytag');
    console.log(amount, pin);
    const data = { amount: amount, pin: pin };

    // toggleDialog('#smodal');

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
      toggleDialog('#smodal');
    } else {
      document.querySelector('.fmsg').textContent = res.error;
      closeModal();
      toggleDialog('#fmodal');
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
