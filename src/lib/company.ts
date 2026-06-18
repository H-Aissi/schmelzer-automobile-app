// T-005
// Unternehmensdaten aus 00_META/UNTERNEHMEN.md — einzige Quelle im Code.
// Platzhalter-Werte werden vom Inhaber vor Deployment ersetzt.
export const company = {
  name: "Schmelzer Automobile",
  address: {
    street: "Heeresstraße",
    zip: "66822",
    city: "Lebach",
  },
  phone: "0162 1948455",
  email: "schmelzerautomobile@outlook.de",
  hours: "MO-FR 9:00-18:00, SA-SO 12:00-17:00",
  social: {
    facebook: "",
    instagram: "",
    whatsapp: "",
  },
  legal: {
    owner: "Mahmoud",
    taxId: "—",
    handelsregister: "—",
    responsible: "← AUSFÜLLEN",
  },
} as const;
