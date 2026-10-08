"""Export original manuscript figures and compiled tables for the project page.

Run with uv run --with pymupdf python scripts/import-paper.py --source-dir PATH --paper PATH.
Only writes assets in this website; never modifies the manuscript repository.
"""
import argparse
import json
from pathlib import Path
import shutil

import fitz


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source-dir', type=Path, required=True)
parser.add_argument('--paper', type=Path, required=True)
args = parser.parse_args()
assets = Path(__file__).resolve().parents[1] / 'dist' / 'assets'
assets.mkdir(parents=True, exist_ok=True)
manifest = []
figures = {
    'overview': ('overview.pdf', 'Figure 1'),
    'ptc-dtc': ('ptc_dtc.pdf', 'Figure 2'),
    'training-paradigms': ('ablation_overview_loca.pdf', 'Figure 3'),
    'training-dynamics-14b': ('training_dynamics_14B.pdf', 'Figure 4'),
    'environment-scaling': ('env_scaling_harness.pdf', 'Figure 7'),
    'training-dynamics-8b': ('training_dynamics_8B.pdf', 'Figure 8'),
}
for output, (filename, label) in figures.items():
    source = args.source_dir / 'figures' / filename
    with fitz.open(source) as document:
        page = document[0]
        extension = 'png' if output == 'training-paradigms' else 'svg'
        if extension == 'png':
            # The source's dense hatch patterns expand to ~14 MB as SVG paths.
            # A 2400px render retains the original appearance and loads quickly.
            scale = 2400 / page.rect.width
            page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False).save(assets / f'{output}.png')
            (assets / f'{output}.svg').unlink(missing_ok=True)
        else:
            (assets / f'{output}.svg').write_text(page.get_svg_image(text_as_path=True))
        if output == 'overview':
            page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5), alpha=False).save(assets / 'overview.png')
        manifest.append({'asset': f'{output}.{extension}', 'label': label, 'source': f'figures/{filename}', 'width': round(page.rect.width), 'height': round(page.rect.height)})
    shutil.copyfile(source, assets / f'{output}.pdf')

# Coordinates refer to the user-provided ICLR27_ProgAgent.pdf, not an archived draft.
# Table crops preserve the exact typography, grouping, emphasis, and values.
tables = {
    'table-1': (6, (107, 111, 505, 169), 'tables/baseline_overview.tex'),
    'table-2': (6, (107, 226, 505, 472), 'tables/main_results.tex'),
    'table-3': (7, (107, 123, 505, 232), 'tables/paradigm_comparison.tex'),
    'table-4': (8, (177, 333, 435, 403), 'tables/env_scale.tex'),
    'table-5': (8, (189, 549, 423, 593), 'tables/programming_structures.tex'),
    'table-6': (9, (119, 122, 493, 220), 'tables/dtc_transfer_loca.tex'),
    'table-7': (21, (107, 159, 505, 718), 'tables/ablations_loca.tex'),
    'table-8': (22, (167, 373, 446, 503), 'tables/mcpmark_interaction_costs.tex'),
}
with fitz.open(args.paper) as document:
    for output, (page_number, rectangle, source) in tables.items():
        clip = fitz.Rect(rectangle)
        cropped = fitz.open()
        cropped.insert_pdf(document, from_page=page_number - 1, to_page=page_number - 1)
        page = cropped[0]
        bounds = page.rect
        # Remove off-crop material, especially Figure 3's dense hatch patterns,
        # instead of embedding an entire hidden manuscript page in each SVG.
        for area in [fitz.Rect(0, 0, bounds.width, clip.y0),
                     fitz.Rect(0, clip.y1, bounds.width, bounds.height),
                     fitz.Rect(0, clip.y0, clip.x0, clip.y1),
                     fitz.Rect(clip.x1, clip.y0, bounds.width, clip.y1)]:
            page.add_redact_annot(area, fill=False)
        page.apply_redactions(images=2, graphics=2)
        page.set_cropbox(clip)
        (assets / f'{output}.svg').write_text(page.get_svg_image(text_as_path=True))
        cropped.save(assets / f'{output}.pdf', garbage=4, deflate=True)
        cropped.close()
        manifest.append({'asset': f'{output}.svg', 'label': output.replace('-', ' ').title(), 'source': source, 'compiled_page': page_number, 'width': round(clip.width), 'height': round(clip.height)})
shutil.copyfile(args.paper, assets / 'ProgAgent.pdf')
(assets / 'sources.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Exported {len(manifest)} original figures and tables to {assets}')
