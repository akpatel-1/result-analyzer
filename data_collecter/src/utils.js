export const utils = {
  generateRollNumbers(startRollNo, endRollNo) {
    if (startRollNo.length !== endRollNo.length) {
      throw new Error("Start and end roll numbers must have the same length");
    }
    const prefix = startRollNo.slice(0, -3);
    const startN = parseInt(startRollNo.slice(-3));
    const endN = parseInt(endRollNo.slice(-3));

    const rolls = [];
    for (let i = startN; i <= endN; i++) {
      rolls.push(prefix + String(i).padStart(3, "0"));
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

//csvtu.digivarsity.online/WebApp/Result/SemesterResult.aspx?S=1%20SEMESTER&E=NOV-DEC%202023&R=303302223048&T=RTRV
