from pathlib import Path

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn


INPUT = Path(r"D:\BOMP原型demo\outputs\BOMP知识共享中心业务需求说明书-4.4.2修订版.docx")
TEMP_OUTPUT = INPUT.with_name(INPUT.stem + ".fields.tmp.docx")


doc = Document(str(INPUT))
settings = doc.settings.element
for node in settings.findall(qn("w:updateFields")):
    settings.remove(node)
update_fields = OxmlElement("w:updateFields")
update_fields.set(qn("w:val"), "true")
settings.append(update_fields)
doc.save(str(TEMP_OUTPUT))
TEMP_OUTPUT.replace(INPUT)
print("update_fields=true")
