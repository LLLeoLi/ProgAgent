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

// Keep all four original steps in the document; only the selected panel is visible.
const caseWorkspace = document.querySelector('#case-workspace');
const caseTabs = [...document.querySelectorAll('.case-tabs [role="tab"]')];
const casePanels = [...document.querySelectorAll('.case-step[role="tabpanel"]')];
let caseIndex = 0;
function selectCaseStep(index, focusTab = false) {
  caseIndex = index;
  caseTabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    casePanels[i].hidden = i !== index;
  });
  document.querySelector('#case-position').textContent = `Step ${index + 1} of ${caseTabs.length}`;
  document.querySelector('#case-progress').textContent = `${index + 1} / ${caseTabs.length}`;
  document.querySelector('#case-previous').disabled = index === 0;
  document.querySelector('#case-next').disabled = index === caseTabs.length - 1;
  if (focusTab) caseTabs[index].focus();
}
caseTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCaseStep(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % caseTabs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + caseTabs.length - 1) % caseTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = caseTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectCaseStep(next, true);
  });
});
function advanceCaseStep(delta) {
  const next = caseIndex + delta;
  if (next < 0 || next >= caseTabs.length) return;
  selectCaseStep(next);
  casePanels[next].focus({ preventScroll: true });
  if (caseWorkspace.getBoundingClientRect().top < document.querySelector('.site-header').getBoundingClientRect().height + 12) caseWorkspace.scrollIntoView({ block: 'start' });
}
document.querySelector('#case-previous').addEventListener('click', () => advanceCaseStep(-1));
document.querySelector('#case-next').addEventListener('click', () => advanceCaseStep(1));
caseWorkspace.classList.add('enhanced');
selectCaseStep(0);

// Match keyboard navigation semantics to the responsive step layout.
const mobileLayout = window.matchMedia('(max-width: 640px)');
function updateCaseOrientation() {
  document.querySelector('.case-tabs').setAttribute('aria-orientation', mobileLayout.matches ? 'horizontal' : 'vertical');
}
mobileLayout.addEventListener('change', updateCaseOrientation);
updateCaseOrientation();

// Make wide manuscript tables scrollable with the keyboard as well as touch.
document.querySelectorAll('.figure-scroll').forEach(region => {
  const update = () => {
    if (region.scrollWidth > region.clientWidth + 1) {
      region.tabIndex = 0;
      region.setAttribute('role', 'region');
      region.setAttribute('aria-label', region.closest('figure').querySelector('figcaption strong').textContent);
    } else {
      region.removeAttribute('tabindex');
      region.removeAttribute('role');
      region.removeAttribute('aria-label');
    }
  };
  new ResizeObserver(update).observe(region);
  region.querySelector('img').addEventListener('load', update);
});
