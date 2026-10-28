# BOMP 业务需求说明书模板执行说明

## Reference

- Path: `C:\Users\admin\Desktop\BOMP\业务需求说明书\国网物资公司-2025年企业经营管理系统-设计开发实施项目-财务预算管理业务需求规格说明书.docx`
- SHA-256: `5b0425d449de2cd0832341e017f82ffa4f357b2722b2783817fa296f7840271c`
- Cached page count: 34
- Section count: 2
- Render status: unresolved because the bundled workspace runtime does not include `soffice.exe`; section, style, field, image and package audits were used for distillation.

## Page System

- A4 portrait, 210 x 297 mm.
- Margins: left/right 31.75 mm; top/bottom 25.4 mm.
- Header distance 15 mm; footer distance 17.5 mm.
- New document retains the reference page geometry and uses a minimal cover/front-matter/body flow.

## Typography

- Cover project name and document title: centered, black, bold, 26 pt.
- Cover date: centered, Song typeface, black, bold, 16 pt.
- Heading 1: Hei typeface, 14 pt, bold, black.
- Heading 2 and Heading 3: Hei typeface, 12 pt, bold, black.
- Lower headings reuse the reference heading styles without decorative rules.
- Body: Song typeface for Chinese and Times New Roman for Latin text, 10.5 pt, justified, 1.5 line spacing.
- Captions: Hei typeface, 9 pt, centered.

## Tables

- Reuse the reference's full-grid table pattern.
- Header and label cells use gray fills between `BFBFBF` and `D9D9D9`.
- Table text uses Song typeface, 9 pt; header labels are bold and centered.
- Short identifiers and codes are centered; narrative content is left aligned and vertically centered.
- Rows expand automatically; no fixed row heights.

## Components

- Minimal cover page with project name, document title and date.
- Document-control table, revision table and Word TOC field.
- Page numbers in the footer.
- Chapter and table numbering are written explicitly so the body can begin at Chapter 4.

## Content Flow And Slot Map

- Remove the reference's source-specific business content while retaining the package as the style authority.
- Rewrite the title and front matter for BOMP.
- Omit Chapters 1 through 3.
- Chapter 4 is mandatory. Sections 4.1 through 4.3 remain intentionally blank.
- Section 4.4 contains BP process inventory and process descriptions.
- Section 4.5 contains BS activity inventory and activity descriptions.
- Section 4.6 contains the P_BOMP business-information inventory.
- Chapter 5 remains intentionally blank.
- Chapter 6 contains business-information details and the BP/BS/F/UC/P traceability matrix.

## Package Preservation

- Preserve styles, numbering definitions, theme, font table and package relationships where compatible.
- The body document XML is intentionally rebuilt because the requested content and chapter scope differ from the reference.
- Source images are not reused because they belong to the reference subject matter.
- Set `w:updateFields` so Word refreshes the TOC and page fields when opened.

## Fidelity Gates

- Confirm A4 geometry and margins after generation.
- Confirm all required headings, 13 BP entries, 17 BS entries and 12 P entries exist.
- Confirm every BS is mapped to one BP, one software function and at least one use case.
- Confirm sections 4.1 through 4.3 and Chapter 5 have headings but no invented content.
- Inspect every rendered page when an approved renderer is available; otherwise perform structural, overflow-risk and table-width checks and disclose the renderer limitation.
