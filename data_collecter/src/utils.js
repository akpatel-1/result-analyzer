export const utils = {
  generateRollNumbers(startRollNo, endRollNo) {
    if (startRollNo.length !== endRollNo.length) {
      throw new Error("Start and end roll numbers must have the same length");
    }
    const prefix = startRollNo.slice(0, -4);
    const startN = parseInt(startRollNo.slice(-4));
    const endN = parseInt(endRollNo.slice(-4));

    const rolls = [];
    for (let i = startN; i <= endN; i++) {
      rolls.push(prefix + String(i).padStart(4, "0"));
    }
    return rolls;
  },

  buildResultUrl(baseUrl, rollNo) {
    const url = new URL(baseUrl);
    url.searchParams.set("R", rollNo);
    return url.toString();
  },

  buildEmail(fullName, batch) {
    if (!fullName) return null;
    const parts = fullName.trim().toLowerCase().split(/\s+/);
    const first = parts[0];
    const last = parts[parts.length - 1];
    const year = batch ? batch : "";
    return `${first}.${last}${year}@ssipmt.com`;
  },
};
