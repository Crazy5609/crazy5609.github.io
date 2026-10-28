from pathlib import Path

from docx import Document


INPUT = Path(r"D:\BOMP原型demo\outputs\BOMP知识共享中心业务需求说明书.docx")
TEMP_OUTPUT = INPUT.with_name(INPUT.stem + ".edit.tmp.docx")


def set_cell_text(cell, value):
    """Replace visible text while retaining the cell's existing run formatting."""
    paragraph = cell.paragraphs[0]
    runs = paragraph.runs
    if runs:
        runs[0].text = value
        for run in runs[1:]:
            run.text = ""
    else:
        paragraph.add_run(value)
    for paragraph in cell.paragraphs[1:]:
        for run in paragraph.runs:
            run.text = ""


def remove_row(table, row_index):
    row = table.rows[row_index]
    row._element.getparent().remove(row._element)


def main():
    doc = Document(str(INPUT))
    targets = [
        table
        for table in doc.tables
        if table.rows
        and table.cell(0, 0).text.strip() == "流程编号"
        and len(table.rows) == 7
    ]
    if len(targets) != 13:
        raise RuntimeError(f"Expected 13 section 4.4.2 tables, found {len(targets)}")

    for table in targets:
        # Rename the retained fields and preserve their existing values.
        set_cell_text(table.cell(0, 0), "活动编号")
        set_cell_text(table.cell(0, 2), "活动名称")
        set_cell_text(table.cell(1, 2), "使用组织单元")
        set_cell_text(table.cell(1, 3), "国网物资公司")
        set_cell_text(table.cell(2, 0), "活动描述")

        # Remove the fields explicitly excluded from the revised activity table.
        for row_index in (6, 5, 4, 3):
            remove_row(table, row_index)

    doc.save(str(TEMP_OUTPUT))
    TEMP_OUTPUT.replace(INPUT)
    print(f"updated_tables={len(targets)}")


if __name__ == "__main__":
    main()
