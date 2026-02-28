import os
import json


def build_output_folder(batch, semester):
    return os.path.join("data", f"{batch}_s{semester}")


def build_output_filename(roll_no, exam_type, attempt, review_type):
    suffix = str(roll_no)[-4:]
    exam_type_normalized = (exam_type or "").strip().lower()
    review_part = (review_type or "").strip().lower()

    if exam_type_normalized == "regular":
        if review_part in {"rtrv", "rrv"}:
            return f"{suffix}_{review_part}.json"
        return f"{suffix}.json"

    if exam_type_normalized == "backlog":
        base_name = f"{suffix}_attempt{attempt}"
        if review_part in {"rtrv", "rrv"}:
            base_name = f"{base_name}_{review_part}"
        return f"{base_name}.json"

    raise ValueError("exam_type must be either 'Regular' or 'Backlog'.")


def save_json(data, batch, semester, exam_type, attempt, review_type):
    folder = build_output_folder(batch, semester)
    os.makedirs(folder, exist_ok=True)

    roll_no = data.get("roll_no")
    if not roll_no and isinstance(data.get("student"), dict):
        roll_no = data["student"].get("roll_no")
    if not roll_no:
        raise ValueError("Missing roll number in parsed data")

    filename = build_output_filename(roll_no, exam_type, attempt, review_type)
    file_path = os.path.join(folder, filename)

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    return folder