const toCurrency = (price) => {
  return new Intl.NumberFormat('en-EN', {
    currency: 'USD',
    style: 'currency',
  }).format(price);
};

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const textarea = document.querySelector('#description');
if (textarea) {
  (function (t) {
    let hiddenDiv = document.createElement('div');
    let content = null;
    hiddenDiv.classList.add('description');
    hiddenDiv.style.display = 'none';
    hiddenDiv.style.whiteSpace = 'pre-wrap';
    hiddenDiv.style.wordWrap = 'break-word';

    t.addEventListener('input', function () {
      t.parentNode.appendChild(hiddenDiv);
      t.style.resize = 'none';
      t.style.overflow = 'hidden';
      content = t.value;
      content = content.replace(/\n/g, '<br>');
      hiddenDiv.innerHTML = content + '<br style="line-height: 3px;">';
      hiddenDiv.style.visibility = 'hidden';
      hiddenDiv.style.display = 'block';
      t.style.height = hiddenDiv.offsetHeight + 'px';
      hiddenDiv.style.visibility = 'visible';
      hiddenDiv.style.display = 'none';
    });
  })(textarea);
}

document.addEventListener('DOMContentLoaded', function () {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Tabs.init(document.querySelectorAll('#tabs-swipe'));
  M.FormSelect.init(document.querySelectorAll('select'));
  M.Parallax.init(document.querySelectorAll('.parallax'));

  const options = { fullWidth: true, indicators: true };
  M.Carousel.init(document.querySelectorAll('.carousel-slider'), options);
});

const toast = document.querySelector('.toast');
if (toast) {
  M.toast({ html: toast.value });
}
