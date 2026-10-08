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

// Recorded excerpts from Appendix E.1. These are display-only, never executed.
const examples = {
  query: {
    file: 'query.py',
    code: `results = tools["notion_API-post-database-query"](
    database_id=db_id,
    filter={
        "property": "SpentAmount",
        "number": {"less_than": 800}
    }
)`,
    label: 'RUNTIME STATE',
    output: 'The query response is stored in `results`.\nIntermediate records stay inside the runtime.',
  },
  aggregate: {
    file: 'aggregate.py',
    code: `from collections import Counter
ad_counts, audience_reach_by_type = Counter(), Counter()
for r in results["results"]:
    props = r["properties"]
    ad_type = props["AdType"]["select"]["name"]
    ad_counts[ad_type] += 1
    audience_reach_by_type[ad_type] += props["AudienceReach"]["number"]
for ad_type, count in ad_counts.most_common():
    avg_reach = audience_reach_by_type[ad_type] / count
    print(f"{ad_type}: {count} campaigns, avg audience reach={avg_reach:.1f}")`,
    label: 'RECORDED OUTPUT',
    output: 'Social Media: 30 campaigns, avg audience reach=23512.0\nSearch Engine: 28 campaigns, avg audience reach=24872.6\nVideo: 20 campaigns, avg audience reach=25063.5\nBanner: 17 campaigns, avg audience reach=19380.5',
  },
  answer: {
    file: 'summarize.py',
    code: `print("Most common type:", ad_counts.most_common(1)[0][0])
least_common_type = ad_counts.most_common()[-1][0]
print("Least common type:", least_common_type)
avg_reach = (audience_reach_by_type[least_common_type]
             / ad_counts[least_common_type])
print(f"Average audience reach for {least_common_type}: {avg_reach:.1f}")`,
    label: 'RECORDED OUTPUT',
    output: 'Most common type: Social Media\nLeast common type: Banner\nAverage audience reach for Banner: 19380.5',
  },
};
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  const step = examples[button.dataset.step];
  document.querySelectorAll('[data-step]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#example-file').textContent = step.file;
  const code = document.createElement('code');
  code.textContent = step.code;
  document.querySelector('#example-code').replaceChildren(code);
  document.querySelector('#output-label').textContent = step.label;
  document.querySelector('#example-output').textContent = step.output;
}));

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
