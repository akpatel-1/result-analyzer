def resolve_stage(exam_type):
    normalized_type = (exam_type or "").strip().upper()

    if normalized_type == "REGULAR":
        return "Regular", 1, 0, False
    if normalized_type == "BACKLOG":
        return "Backlog", 1, 0, True
    if normalized_type == "RTRV":
        return "RTRV", 1, 1, True
    if normalized_type == "RRV":
        return "RRV", 1, 2, True

    raise ValueError(
        "Unsupported exam type in URL. Allowed T values: Regular, Backlog, RTRV, RRV."
    )