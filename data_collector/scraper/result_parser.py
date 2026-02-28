from bs4 import BeautifulSoup
import re


def safe_int(value):
    value = value.strip()
    if not value or value == "\xa0":
        return None

    upper_value = value.upper()
    if upper_value in {"ABS"}:
        return None

    match = re.search(r"\d+", value)
    if not match:
        return None

    return int(match.group(0))


def safe_float(value):
    value = value.strip()
    if not value or value == "\xa0":
        return None
    return float(value)


def safe_text(soup, element_id, default=""):
    element = soup.find(id=element_id)
    if not element:
        return default
    return element.text.strip()


def parse_result_page(html, semester, session, exam_type, attempt_no, review_type, batch):
    soup = BeautifulSoup(html, "html.parser")

    roll_no = safe_text(soup, "roll_no")
    if not roll_no:
        raise ValueError("Roll number not found on result page")

    subjects = []

    table = soup.find("table", id="GdUnReport")
    if not table:
        raise ValueError("Result subject table not found")

    rows = table.find_all("tr")[2:]  # skip header rows

    for row in rows:
        cols = [c.text.strip() for c in row.find_all("td")]
        if len(cols) < 11:
            continue

        letter_grade = cols[11].strip() if len(cols) > 11 else ""
        subject_result = "Fail" if letter_grade.upper() in ["F", "FF"] else "Pass"

        subject = {
            "code": cols[1].split("(")[0].strip(),
            "name": cols[2],
            "max_ese": safe_int(cols[3]),
            "obt_ese": safe_int(cols[4]),
            "max_ct": safe_int(cols[5]),
            "obt_ct": safe_int(cols[6]),
            "max_ta": safe_int(cols[7]),
            "obt_ta": safe_int(cols[8]),
            "max_total": safe_int(cols[9]),
            "obt_total": safe_int(cols[10]),
            "result": subject_result,
        }

        subjects.append(subject)

    return {
        "roll_no": roll_no,
        "name": safe_text(soup, "NOC"),
        "enroll_id": safe_text(soup, "enroll"),
        "abc_id": safe_text(soup, "abcid") or None,
        "batch": batch,
        "branch": safe_text(soup, "NOEx"),
        "semester": semester,
        "exam_session": session,
        "exam_type": exam_type,
        "attempt_no": attempt_no,
        "review_type": review_type,
        "spi": safe_float(safe_text(soup, "spi", default="")),
        "max_total_marks": safe_int(safe_text(soup, "mxmarks", default="")),
        "obt_total_marks": safe_int(safe_text(soup, "obtmarks", default="")),
        "overall_result": safe_text(soup, "Result"),
        "subjects": subjects
    }