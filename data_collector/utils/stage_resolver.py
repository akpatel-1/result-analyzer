def resolve_stage(exam_type):
    normalized_type = (exam_type or "").strip().upper()

    if normalized_type == "REGULAR":
        return "Regular", 1, None, False
    if normalized_type == "BACKLOG":
        return "Backlog", 1, None, False
    if normalized_type in {"RTRV", "RRTV"}:
        return "RTRV", 1, "RTRV", True
    if normalized_type == "RRV":
        return "RRV", 1, "RRV", True

    raise ValueError(
        "Unsupported exam type in URL. Allowed T values: Regular, Backlog, RTRV, RRV."
    )