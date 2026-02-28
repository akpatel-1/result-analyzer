from scraper.driver import get_driver
from scraper.login import login
from scraper.result_navigator import build_roll_url, open_result_page
from scraper.result_parser import parse_result_page
from utils.url_parser import parse_result_url
from utils.stage_resolver import resolve_stage
from utils.json_saver import save_json, build_output_folder


def main():
    base_url = input("Enter result URL: ")
    range_text = input("Enter roll range (e.g. 3001-3155): ").strip()
    batch = int(input("Enter batch year (e.g. 2023): "))

    semester, session, start_roll, exam_type = parse_result_url(base_url)
    try:
        exam_type_clean, attempt_no, review_type, needs_attempt_input = resolve_stage(exam_type)
    except ValueError as exc:
        print(exc)
        return

    if needs_attempt_input:
        attempt_text = input(
            "Enter backlog attempt (0 for Regular, 1-3 for Backlog): "
        ).strip()
        if not attempt_text.isdigit():
            print("Attempt must be 0, 1, 2, or 3.")
            return

        selected_attempt = int(attempt_text)
        if selected_attempt < 0 or selected_attempt > 3:
            print("Attempt must be 0, 1, 2, or 3.")
            return

        if selected_attempt == 0:
            exam_type_clean = "Regular"
            attempt_no = 1
        else:
            exam_type_clean = "Backlog"
            attempt_no = selected_attempt

    output_folder = build_output_folder(batch, semester)
    selected_review = review_type if review_type is not None else "none"
    print(
        f"Selected -> exam_type: {exam_type_clean}, review_type: {selected_review}, attempt: {attempt_no}"
    )

    start_roll_text = str(start_roll).strip()
    if len(start_roll_text) < 4 or not start_roll_text.isdigit():
        print("Invalid starting roll in URL.")
        return

    if "-" not in range_text:
        print("Roll range must be in format start-end (e.g. 3001-3155).")
        return

    start_suffix_text, end_suffix_text = [part.strip() for part in range_text.split("-", 1)]
    if (
        not start_suffix_text.isdigit()
        or not end_suffix_text.isdigit()
        or len(start_suffix_text) > 4
        or len(end_suffix_text) > 4
    ):
        print("Both start and end suffix must be numeric and up to 4 digits.")
        return

    prefix = start_roll_text[:-4]
    start_suffix = int(start_suffix_text)
    end_suffix = int(end_suffix_text)

    if end_suffix < start_suffix:
        print("Ending suffix must be greater than or equal to starting suffix.")
        return

    driver = get_driver()

    if not login(driver):
        print("Login failed.")
        driver.quit()
        return

    for suffix in range(start_suffix, end_suffix + 1):
        roll_str = f"{prefix}{suffix:04d}"

        url = build_roll_url(base_url, roll_str)
        open_result_page(driver, url)

        if "No Record Found" in driver.page_source:
            print(f"No result for {roll_str}")
            continue

        try:
            data = parse_result_page(
                driver.page_source,
                semester,
                session,
                exam_type_clean,
                attempt_no,
                review_type,
                batch
            )
        except ValueError as exc:
            print(f"Skipped {roll_str[-4:]}: {exc}")
            continue

        save_json(data, batch, semester, exam_type_clean, attempt_no, review_type)
        print(f"Saved {roll_str[-4:]}")

    driver.quit()
    print(f"Saved folder: {output_folder}")


if __name__ == "__main__":
    main()