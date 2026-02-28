from scraper.driver import get_driver
from scraper.login import login
from scraper.result_navigator import build_roll_url, open_result_page
from scraper.result_parser import parse_result_page
from utils.url_parser import parse_result_url
from utils.stage_resolver import resolve_stage
from utils.json_saver import save_json


def main():
    base_url = input("Enter result URL: ")
    end_roll = int(input("Enter ending roll number: "))
    batch = int(input("Enter batch year (e.g. 2023): "))

    semester, session, start_roll, exam_type = parse_result_url(base_url)
    exam_type_clean, attempt_no, review_stage = resolve_stage(exam_type)

    start_roll = int(start_roll)

    if end_roll < start_roll:
        print("Ending roll must be greater than or equal to starting roll.")
        return

    driver = get_driver()

    if not login(driver):
        print("Login failed.")
        driver.quit()
        return

    for roll in range(start_roll, end_roll + 1):
        roll_str = str(roll)

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
                review_stage,
                batch
            )
        except ValueError as exc:
            print(f"Skipped {roll_str}: {exc}")
            continue

        save_json(data, batch, attempt_no, review_stage)
        print(f"Saved {roll_str}")

    driver.quit()


if __name__ == "__main__":
    main()