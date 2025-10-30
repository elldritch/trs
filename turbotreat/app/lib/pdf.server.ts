import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePdf = fs.readFile(
  path.join(__dirname, "../../static/1040-tr.pdf")
);

export async function render1040() {
  const templateBytes = await templatePdf;
  const doc = await PDFDocument.load(templateBytes);

  const form = doc.getForm();
  const fields = form.getFields();
  fields.forEach((field) => {
    const type = field.constructor.name;
    const name = field.getName();
    console.log(`${type}: ${name}`);
  });

  const rendered = await doc.save();
  return rendered;
}
