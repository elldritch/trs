import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { FormFields } from "./pdf-mapper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePdf = fs.readFile(
  path.join(__dirname, "../../static/1040-tr.pdf")
);

export async function render1040(fields: FormFields): Promise<Uint8Array> {
  const templateBytes = await templatePdf;
  const doc = await PDFDocument.load(templateBytes);
  const form = doc.getForm();

  // Fill text fields
  if (fields.first_name) {
    try {
      form.getTextField('first_name').setText(fields.first_name);
    } catch (e) {
      console.warn('Could not set first_name:', e);
    }
  }

  if (fields.costume_name) {
    try {
      form.getTextField('costume_name').setText(fields.costume_name);
    } catch (e) {
      console.warn('Could not set costume_name:', e);
    }
  }

  if (fields.fav_candy) {
    try {
      form.getTextField('fav_candy').setText(fields.fav_candy);
    } catch (e) {
      console.warn('Could not set fav_candy:', e);
    }
  }

  if (fields.date) {
    try {
      form.getTextField('date').setText(fields.date);
    } catch (e) {
      console.warn('Could not set date:', e);
    }
  }

  // Sibling information
  if (fields.sibling_first_names) {
    try {
      form.getTextField('sibling_first_names').setText(fields.sibling_first_names);
    } catch (e) {
      console.warn('Could not set sibling_first_names:', e);
    }
  }

  if (fields.sibling_costume_names) {
    try {
      form.getTextField('sibling_costume_names').setText(fields.sibling_costume_names);
    } catch (e) {
      console.warn('Could not set sibling_costume_names:', e);
    }
  }

  if (fields.sibling_fav_candies) {
    try {
      form.getTextField('sibling_fav_candies').setText(fields.sibling_fav_candies);
    } catch (e) {
      console.warn('Could not set sibling_fav_candies:', e);
    }
  }

  // Street addresses
  if (fields["1a_streetname"]) {
    try {
      form.getTextField('1a_streetname').setText(fields["1a_streetname"]);
    } catch (e) {
      console.warn('Could not set 1a_streetname:', e);
    }
  }

  if (fields["1b_streetname"]) {
    try {
      form.getTextField('1b_streetname').setText(fields["1b_streetname"]);
    } catch (e) {
      console.warn('Could not set 1b_streetname:', e);
    }
  }

  if (fields["1c_streetname"]) {
    try {
      form.getTextField('1c_streetname').setText(fields["1c_streetname"]);
    } catch (e) {
      console.warn('Could not set 1c_streetname:', e);
    }
  }

  // Percentage fields
  if (fields.tips_percent) {
    try {
      form.getTextField('tips_percent').setText(fields.tips_percent);
    } catch (e) {
      console.warn('Could not set tips_percent:', e);
    }
  }

  if (fields.business_percent) {
    try {
      form.getTextField('business_percent').setText(fields.business_percent);
    } catch (e) {
      console.warn('Could not set business_percent:', e);
    }
  }

  if (fields.payments_pcs) {
    try {
      form.getTextField('payments_pcs').setText(fields.payments_pcs);
    } catch (e) {
      console.warn('Could not set payments_pcs:', e);
    }
  }

  if (fields.home_office_percent) {
    try {
      form.getTextField('home_office_percent').setText(fields.home_office_percent);
    } catch (e) {
      console.warn('Could not set home_office_percent:', e);
    }
  }

  if (fields.rnd_percent) {
    try {
      form.getTextField('rnd_percent').setText(fields.rnd_percent);
    } catch (e) {
      console.warn('Could not set rnd_percent:', e);
    }
  }

  if (fields.savers_percent) {
    try {
      form.getTextField('savers_percent').setText(fields.savers_percent);
    } catch (e) {
      console.warn('Could not set savers_percent:', e);
    }
  }

  if (fields.smarties_percent) {
    try {
      form.getTextField('smarties_percent').setText(fields.smarties_percent);
    } catch (e) {
      console.warn('Could not set smarties_percent:', e);
    }
  }

  if (fields.nonarbor_percent) {
    try {
      form.getTextField('nonarbor_percent').setText(fields.nonarbor_percent);
    } catch (e) {
      console.warn('Could not set nonarbor_percent:', e);
    }
  }

  // School level checkboxes
  if (fields.school_prek) {
    try {
      form.getCheckBox('school_prek').check();
    } catch (e) {
      console.warn('Could not check school_prek:', e);
    }
  }

  if (fields.school_elementary) {
    try {
      form.getCheckBox('school_elementary').check();
    } catch (e) {
      console.warn('Could not check school_elementary:', e);
    }
  }

  if (fields.school_middle) {
    try {
      form.getCheckBox('school_middle').check();
    } catch (e) {
      console.warn('Could not check school_middle:', e);
    }
  }

  if (fields.school_high) {
    try {
      form.getCheckBox('school_high').check();
    } catch (e) {
      console.warn('Could not check school_high:', e);
    }
  }

  if (fields.school_adult) {
    try {
      form.getCheckBox('school_adult').check();
    } catch (e) {
      console.warn('Could not check school_adult:', e);
    }
  }

  // Candy weight checkboxes
  if (fields.candy_weight_025) {
    try {
      form.getCheckBox('candy_weight_025').check();
    } catch (e) {
      console.warn('Could not check candy_weight_025:', e);
    }
  }

  if (fields.candy_weight_050) {
    try {
      form.getCheckBox('candy_weight_050').check();
    } catch (e) {
      console.warn('Could not check candy_weight_050:', e);
    }
  }

  if (fields.candy_weight_100) {
    try {
      form.getCheckBox('candy_weight_100').check();
    } catch (e) {
      console.warn('Could not check candy_weight_100:', e);
    }
  }

  if (fields.candy_weight_150) {
    try {
      form.getCheckBox('candy_weight_150').check();
    } catch (e) {
      console.warn('Could not check candy_weight_150:', e);
    }
  }

  if (fields.candy_weight_200) {
    try {
      form.getCheckBox('candy_weight_200').check();
    } catch (e) {
      console.warn('Could not check candy_weight_200:', e);
    }
  }

  if (fields.candy_weight_300) {
    try {
      form.getCheckBox('candy_weight_300').check();
    } catch (e) {
      console.warn('Could not check candy_weight_300:', e);
    }
  }

  // Yes/No checkboxes
  if (fields.film_yes) {
    try {
      form.getCheckBox('film_yes').check();
    } catch (e) {
      console.warn('Could not check film_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('film_no').check();
    } catch (e) {
      console.warn('Could not check film_no:', e);
    }
  }

  if (fields.illegal_yes) {
    try {
      form.getCheckBox('illegal_yes').check();
    } catch (e) {
      console.warn('Could not check illegal_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('illegal_no').check();
    } catch (e) {
      console.warn('Could not check illegal_no:', e);
    }
  }

  if (fields.dependents_yes) {
    try {
      form.getCheckBox('dependents_yes').check();
    } catch (e) {
      console.warn('Could not check dependents_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('dependents_no').check();
    } catch (e) {
      console.warn('Could not check dependents_no:', e);
    }
  }

  if (fields.green_yes) {
    try {
      form.getCheckBox('green_yes').check();
    } catch (e) {
      console.warn('Could not check green_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('green_no').check();
    } catch (e) {
      console.warn('Could not check green_no:', e);
    }
  }

  if (fields.opportunity_yes) {
    try {
      form.getCheckBox('opportunity_yes').check();
    } catch (e) {
      console.warn('Could not check opportunity_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('opportunity_no').check();
    } catch (e) {
      console.warn('Could not check opportunity_no:', e);
    }
  }

  if (fields.local_yes) {
    try {
      form.getCheckBox('local_yes').check();
    } catch (e) {
      console.warn('Could not check local_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('local_no').check();
    } catch (e) {
      console.warn('Could not check local_no:', e);
    }
  }

  if (fields.dental_yes) {
    try {
      form.getCheckBox('dental_yes').check();
    } catch (e) {
      console.warn('Could not check dental_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('dental_no').check();
    } catch (e) {
      console.warn('Could not check dental_no:', e);
    }
  }

  if (fields.sweetwest_yes) {
    try {
      form.getCheckBox('sweetwest_yes').check();
    } catch (e) {
      console.warn('Could not check sweetwest_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('sweetwest_no').check();
    } catch (e) {
      console.warn('Could not check sweetwest_no:', e);
    }
  }

  if (fields.election_yes) {
    try {
      form.getCheckBox('election_yes').check();
    } catch (e) {
      console.warn('Could not check election_yes:', e);
    }
  }
  else {
    try {
      form.getCheckBox('election_no').check();
    } catch (e) {
      console.warn('Could not check election_no:', e);
    }
  }

  // Save and return the filled PDF
  const rendered = await doc.save();
  return rendered;
}
