const MEDICAL_WORDS = [
  "pharmacotherapeutics",
  "dihydrotestosterone",
  "immunosuppressive",
  "electrocardiogram",
  "pharmacokinetics",
  "pharmacogenomics",
  "pharmacoeconomic",
  "pharmacodynamics",
  "immunodeficiency",
  "hypersensitivity",
  "transplantation",
  "pharmacodynamic",
  "neuroadaptation",
  "immunopathology",
  "glucuronidation",
  "gluconeogenesis",
  "aminoglycosides",
  "osteoarthritis",
  "inflammatories",
  "hyperlipidemia",
  "glucocorticoid",
  "dacryocystitis",
  "conjunctivitis",
  "triglycerides",
  "prostaglandin",
  "hyperglycemic",
  "hyperglycemia",
  "tuberculosis",
  "triglyceride",
  "neurological",
  "lipoproteins",
  "hypoglycemic",
  "hypoglycemia",
  "hypertensive",
  "hypertension",
  "hemophiliacs",
  "glycoprotein",
  "diencephalon",
  "ventricular",
  "blepharitis",
  "pediculosis",
  "ophthalmics",
  "microtubule",
  "mediastinum",
  "mediastinal",
  "ganglionics",
  "nociceptors",
  "nucleotides",
  "glomerulosa",
  "geriatrics",
  "nociceptor",
  "organelles",
  "bacterials",
  "iatrogenic",
  "hepatocyte",
  "auscultate",
  "metastatic",
  "meningitis",
  "microbials",
  "gingivitis",
  "pneumonia",
  "maxillary",
  "tricyclic",
  "diabetics",
  "gefitinib",
  "glaucomas",
  "occlusion",
];

const hasMedical = (_outline: string, translation: string) =>
  MEDICAL_WORDS.includes(translation);

export default hasMedical;