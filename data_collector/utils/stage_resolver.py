import re


def resolve_stage(exam_type):
    text = (exam_type or "").strip()
    upper_text = text.upper()

    attempt_no = 1
    review_stage = 0

    attempt_match = re.search(r"ATTEMPT\s*(\d+)", upper_text)
    if attempt_match:
        attempt_no = int(attempt_match.group(1))
    elif any(token in upper_text for token in ("ATKT", "BACK", "SUPPLEMENTARY", "REPEAT")):
        attempt_no = 2

    if "RECHECK" in upper_text or "RE-CHECK" in upper_text:
        review_stage = 1
    elif "REASSESS" in upper_text or "RE-ASSESS" in upper_text:
        review_stage = 2

    exam_type_clean = text.split("-")[0].strip() if text else "Regular"
    if not exam_type_clean:
        exam_type_clean = "Regular"

    return exam_type_clean, attempt_no, review_stage