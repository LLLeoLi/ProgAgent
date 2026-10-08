"use strict";

// Table 2 of the manuscript; the complete original table is displayed below.
const scores = { 8: [18.3, 24.3, 9.3, 38.6], 14: [29.7, 38.3, 17.1, 45.6] };
document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
  const size = button.dataset.size;
  document.querySelectorAll('[data-size]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#results-summary').textContent = `ProgAgent-${size}B · PTC training and evaluation`;
  document.querySelectorAll('#benchmark-grid strong').forEach((element, index) => {
    element.replaceChildren(document.createTextNode(scores[size][index].toFixed(1)));
    const suffix = document.createElement('small');
    suffix.textContent = '%';
    element.append(suffix);
  });
}));

const dialog = document.querySelector('#figure-dialog');
const dialogImage = document.querySelector('#dialog-image');
let figureTrigger;
document.querySelectorAll('.figure-open').forEach(link => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !dialog.showModal) return;
  event.preventDefault();
  figureTrigger = link;
  const figure = link.closest('figure');
  dialogImage.src = link.href;
  dialogImage.alt = figure.querySelector('img').alt;
  document.querySelector('#dialog-original').href = link.href;
  document.querySelector('#figure-dialog-title').textContent = figure.querySelector('figcaption strong')?.textContent || 'Paper figure';
  dialog.showModal();
}));
document.querySelector('#close-figure').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => figureTrigger?.focus());

document.querySelector('#copy-citation').addEventListener('click', async () => {
  const code = document.querySelector('#bibtex');
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(code.textContent);
    status.textContent = 'BibTeX copied to clipboard.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C (or ⌘C) to copy.';
  }
});
