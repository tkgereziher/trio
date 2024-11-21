const ERROR_MESSAGES = {
  204: "No content.",
  400: "Bad Request.",
  401: "Wrong password.",
  403: "Forbidden.",
  404: "Resource not found.",
  412: "Pre condition failed.",
  415: "Unsupported media type.",
  422: "Data validation error.",
  424: "Failed dependency.",
  500: "Internal server error.",
  502: "Bad gateway.",
};

const SUCCESS_MESSAGES = {
  200: "Record updated.",
  201: "Record saved.",
  204: "Record deleted.",
};

const successCodes = [200, 201, 204];
const errorCodes = [422, 424];

const PORTFOLIO_TYPES = ["Survey", "Policy Analysis"];
const SEX_OPTIONS = [
  { text: "Male", value: "Male" },
  { text: "Female", value: "Female" },
];
const ROLE_VALUES = {
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
  WAITER: "waiter",
  CASHIER: "cashier",
  KITCHEN: "kitchen",
  BARTENDER: "bartender",
  BARBER: "barber",
  ENTERTAINMENT: "entertainment",
};

const USER_STATE = {
  DEACTIVATED: 912,
  ACTIVE: 900,
};

const ARTICLE_STATES = {
  DRAFT_SAVED: 900,
  PUBLISHED: 901,
};

const RELIGIONS = ["Orthodox", "Muslim", "Catholic", "Other"];

const OCCUPATION = [
  "Public Job",
  "House Servant",
  "Student",
  "Agriculture",
  "Private Work (Self Employed)",
  "Job Seeker",
  "Child",
];

const INCOME_SOURCE = [
  "Salary",
  "Merchant",
  "AGA Activity (Agriculture Animal Production)",
  "Others",
];

const DIFFICULTY = [
  "No Difficulty",
  "Difficulty seeing",
  "Difficulty hearing",
  "Difficulty walking",
  "Difficulty remembering",
  "Difficulty self care",
  "Difficulty communicating",
  "Chronically ill",
];

const RELATIONSHIP = ["Mother", "Son", "Daughter", "Uncle", "Servant", "Other"];

const MARITAL_STATUS = [
  // { value: null, text: "Select...", disabled: true },
  "Single",
  "Married",
  "Divorced",
  "Separated",
  "Widowed",
];
const MOTHER_TONGUE = [
  { text: "Tigrigna", value: "Tigrigna" },
  { text: "Amharic", value: "Amharic" },
  { text: "English", value: "English" },
];
const ACADEMIC_RANK = [
  "Uneducated",
  "Kindergarten",
  "1st grade",
  "2nd grade",
  "3rd grade",
  "4th grade",
  "5th grade",
  "6th grade",
  "7th grade",
  "8th grade",
  "9th grade",
  "10th grade",
  "11th grade",
  "12th grade",
  "1st year college",
  "2nd year college",
  "3rd year college",
  "10 + 1",
  "10 + 2",
  "10 + 3",
  "TVET level 1",
  "TVET level 2",
  "TVET level 3",
  "TVET level 4",
  "University student",
  "BSc degree",
  "MSc degree",
];

const LANG_SKILL_LEVELS = [
  { value: 6, text: "Native" },
  { value: 5, text: "Bilingual Proficiency" },
  { value: 4, text: "Full Professional Proficiency" },
  { value: 3, text: "Professional Working Proficiency" },
  { value: 2, text: "Limited Working Proficiency" },
  { value: 1, text: "Elementary Proficiency" },
];
const EMPLOYMENT_TERMS = [
  { text: "Permanent", value: "Permanent" },
  { text: "Contract", value: "Contract" },
  { text: "Other", value: "Other" },
];

const MONTHS = [
  { text: "Jan", value: 1 },
  { text: "Feb", value: 2 },
  { text: "Mar", value: 3 },
  { text: "Apr", value: 4 },
  { text: "May", value: 5 },
  { text: "Jun", value: 6 },
  { text: "Jul", value: 7 },
  { text: "Aug", value: 8 },
  { text: "Sep", value: 9 },
  { text: "Nov", value: 10 },
  { text: "Dec", value: 11 },
];

const CONFIG = {
  title: "Web Portal",
  brand: "Efoyta<span class='brand2'>Safe</span>",
};

const COUNTRY = ["Ethiopia", "Eritrea", "Somalia", "South Sudan", "Sudan"];

export {
  ERROR_MESSAGES,
  ROLE_VALUES,
  OCCUPATION,
  INCOME_SOURCE,
  RELATIONSHIP,
  DIFFICULTY,
  ARTICLE_STATES,
  PORTFOLIO_TYPES,
  SEX_OPTIONS,
  RELIGIONS,
  MARITAL_STATUS,
  ACADEMIC_RANK,
  MOTHER_TONGUE,
  EMPLOYMENT_TERMS,
  LANG_SKILL_LEVELS,
  MONTHS,
  SUCCESS_MESSAGES,
  successCodes,
  errorCodes,
  USER_STATE,
  CONFIG,
  COUNTRY,
};
