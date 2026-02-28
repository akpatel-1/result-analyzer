import os
import json


def save_json(data, batch, attempt, review):
    folder = f"data/output/{batch}_a{attempt}_r{review}"
    os.makedirs(folder, exist_ok=True)

    roll_no = data.get("roll_no")
    if not roll_no and isinstance(data.get("student"), dict):
        roll_no = data["student"].get("roll_no")
    if not roll_no:
        raise ValueError("Missing roll number in parsed data")

    file_suffix = str(roll_no)[-4:]
    file_path = os.path.join(folder, f"{file_suffix}.json")

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)