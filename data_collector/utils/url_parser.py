from urllib.parse import urlparse, parse_qs

def parse_result_url(url):
    parsed = urlparse(url)
    params = parse_qs(parsed.query)

    semester = params.get("S", [""])[0]
    session = params.get("E", [""])[0]
    roll_no = params.get("R", [""])[0]
    exam_type = params.get("T", [""])[0]

    semester_number = int(semester.split()[0])

    return semester_number, session, roll_no, exam_type