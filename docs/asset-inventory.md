# A1C reference asset inventory

Checked: 15 October 2026 (Asia/Manila). Scope: Phase 1 foundation only.

## Verified source and retrieval

The user supplied the [A1C Materials Google Drive folder](https://drive.google.com/drive/folders/1l4sllYsgLh3yqqwREAnnPTlLb5eMhKKv?usp=sharing). The folder was read through the connected Google Drive tool. Exact matching A1C image files were fetched as their original PNG/JPEG bytes through authenticated raw-file downloads. No file sharing settings or source files were changed.

Only the official logo is served in Phase 1. The car, motorcycle and classroom originals are retained in `reference-assets/` for future authorized phases and are not shipped in the website build.

| Source filename | Google Drive file ID | Local path | Dimensions | Bytes |
| --- | --- | --- | --- | ---: |
| `A1C WALL - transparent bg.png` | `1Q4XtJqXRKaEIS8BzZYJm2-aEG6VNjWr9` | `public/media/a1c-logo.png` | 1600 × 345 RGBA | 187,441 |
| `vios with border.png` | `1dxDNy3OQyOQ0mdWyREBIS2K7fsA8Qm2g` | `reference-assets/vios-front.png` | 3000 × 2000 RGBA | 2,255,576 |
| `vios side wiht border.png` | `1t-VQxh6YB35rIVIHKptiTVO0K18qZHz8` | `reference-assets/vios-side.png` | 737 × 339 RGBA | 174,112 |
| `wigo with border.png` | `13HArKFqMHeOEITYdY0h9hph8eamHU03i` | `reference-assets/wigo-front.png` | 3000 × 2000 RGBA | 2,203,967 |
| `wigo side with border.png` | `1SdUsJUomm9yEUDCZEYveUjSc7w643dgj` | `reference-assets/wigo-side.png` | 737 × 339 RGBA | 183,535 |
| `mc single model with border.png` | `1AGkR9VG6AvXm79nhHCGdO6Ps6C2I_K1A` | `reference-assets/motorcycle.png` | 866 × 1154 RGBA | 451,517 |
| `tdc.jpg` | `1t8bvYcL6W-VMYlsfhaI0jx_19WgenZAW` | `reference-assets/tdc.jpg` | 2048 × 1536 RGB | 317,180 |

The logo and classroom image were visually checked. The classroom matches the previously supplied student photo. The exact transparent logo requested by the user was selected rather than other branch logo variants present in the shared folder.

## File integrity

All retrieved originals were copied without image processing, recompression, resizing, trimming, or generated edits. SHA-256 checksums:

```text
8ba43a1f84fed4c5b0890d25a65b0d77d3aa2cacecc99c60edbc07b8dc3aaad6  public/media/a1c-logo.png
4408e1cf00de26705912eae82c349db07986cf05a3d5df734d3ee30b1c8cf55d  reference-assets/vios-front.png
930786f9843429b6b5df6cb5beb51c64a9ae59589a718e88d94ae83b1402b2f3  reference-assets/vios-side.png
c416d35ad0aaceec9ebd86a3dece70a83e8dbd3ccb57ec72293c2f82ed1707d8  reference-assets/wigo-front.png
dc2960d6f60ccd1ee1c98c9ceae3e56c0c49b51f82d3e77140c4e9c30366170e  reference-assets/wigo-side.png
552c2c70fa8d83dd6772fc32d20a3e0a913d681bd90387cffd370ac42eba585b  reference-assets/motorcycle.png
d5f237dbd468a4944a70d6f1b578ccb052b743f0cd0e4bd72f4918c24eae071c  reference-assets/tdc.jpg
```

The logo's transparent bounds are `(91, 18, 1504, 338)` in a 1600 × 345 canvas. Its accreditation strapline is black; use a light backing surface in dark mode rather than recoloring the logo. The Vios front image includes generous transparent margins: visible bounds `(663, 453, 2533, 1637)` in its 3000 × 2000 canvas. These are layout observations only; neither image was cropped.

## Prior attachment recovery

The original chat attachment paths beginning with `/tmp/codex-remote-attachments/01a1359d-49ab-75b8-98cd-88e208e6308f/` are no longer available. Earlier local checks and keyword-based Drive searches did not find the files. The user's direct folder URL resolved retrieval successfully; no further re-upload of the recovered references is needed.

| Prior chat filename | Recovered reference |
| --- | --- |
| `5551.jpg` logo on black | Superseded by the user's newly requested original transparent logo |
| `5594.png` hatchback side | `reference-assets/wigo-side.png` |
| `5595.png` hatchback front | `reference-assets/wigo-front.png` |
| `5592.png` sedan side | `reference-assets/vios-side.png` |
| `5593.png` sedan front | `reference-assets/vios-front.png` |
| `5590.png` motorcycle | `reference-assets/motorcycle.png` |
| `5591.jpg` classroom | `reference-assets/tdc.jpg` |
| `5581.jpg` brand palette | Exact color values retained below; original palette image not required for rendering |

## Retained brand decisions

- Primary red: `#E11D48`.
- Primary blue: `#1D4ED8`.
- Supporting light blue: `#93C5FD`.
- Deep navy: `#0F172A`.
- The user explicitly replaced original pale pink `#FCE7F3` with dirty white. The implementation's dirty-white token is a Phase 1 design choice; no exact replacement hex was provided by the user.
- Brand: **A1C Driving Academy – Trece Martires Branch**.
- Working hero tagline: **Start Smart. Drive Confident.**

## Existing files intentionally excluded

- `/workspace/scratch/reference-contact-sheet.jpg` contains the earlier furniture-website animation inspiration, not A1C assets.
- `/workspace/scratch/a1c-qa/*.png` contains the previous concept website screenshots, not original references.
- `/workspace/library-files/a1c-driving-animation.zip` contains the previous website's code, styles and Three.js dependencies, not original A1C imagery.
- Other branch logo variants, historical promotional graphics and registration forms in the shared Drive folder were not downloaded or added to the website.

## Future reference needs

1. Confirm which physical car is manual and which is automatic before assigning it to a PDC course; do not infer transmission from photographs.
2. Request additional vehicle/motorcycle/classroom angles only if the recovered reference views are insufficient for recognizable 3D geometry.
3. Obtain office and driving-range photos and student assessment videos before Phase 5. They were described as available or forthcoming, but were not among the matching references downloaded here.

## Handling rules

- Use supplied A1C references as primary visual evidence. Do not replace them with invented logos or generic/generated vehicles, people or facilities.
- Keep recovered original media unchanged. Create clearly named optimized derivatives only when the relevant phase needs them, preserving originals and provenance.
- Keep future media in `reference-assets/` outside `public/` until needed by an approved phase.
- Do not build the later 3D scenes during Phase 1.
- Ask for missing or insufficient references before asset-dependent work, as required by master-prompt Section 4.
