const toCurrency = (price) => {
  return new Intl.NumberFormat('en-EN', {
    currency: 'USD',
    style: 'currency',
  }).format(price);
};

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

M.Sidenav.init(document.querySelectorAll('.sidenav'));
M.Tabs.init(document.querySelectorAll('#tabs-swipe'));
M.FormSelect.init(document.querySelectorAll('select'));
