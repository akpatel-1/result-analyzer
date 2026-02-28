import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config.settings import LOGIN_ID, PASSWORD, LOGIN_URL
from scraper.captcha_solver import solve_captcha


def open_student_login_form(driver, wait):
    driver.get(LOGIN_URL)
    student_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//p[normalize-space()='Student Login']"))
    )
    student_btn.click()
    wait.until(EC.presence_of_element_located((By.ID, "LoginID")))


def set_input_value(driver, wait, by, locator, value):
    field = wait.until(EC.presence_of_element_located((by, locator)))
    wait.until(lambda d: field.is_displayed() and field.is_enabled())

    try:
        field.click()
        field.send_keys(Keys.CONTROL, "a")
        field.send_keys(Keys.DELETE)
        field.send_keys(str(value))
    except Exception:
        driver.execute_script(
            """
            const element = arguments[0];
            const val = arguments[1];
            element.removeAttribute('readonly');
            element.removeAttribute('disabled');
            element.value = val;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            """,
            field,
            str(value),
        )


def login(driver):
    wait = WebDriverWait(driver, 10)

    for attempt in range(5):
        try:
            open_student_login_form(driver, wait)

            set_input_value(driver, wait, By.ID, "LoginID", LOGIN_ID)
            set_input_value(driver, wait, By.ID, "Password", PASSWORD)

            captcha_img = driver.find_element(By.XPATH, "//img[contains(@src,'GetCaptcha')]")
            captcha_img.screenshot("data/screenshots/captcha.png")

            captcha_text = solve_captcha("data/screenshots/captcha.png").strip()
            if not captcha_text:
                print(f"Login failed attempt {attempt+1}: empty captcha OCR")
                continue

            print(f"Login attempt {attempt+1}: captcha={captcha_text}")
            set_input_value(driver, wait, By.ID, "captcha", captcha_text)

            citizen_radio = driver.find_element(By.XPATH, "//input[@value='Citizen']")
            if not citizen_radio.is_selected():
                citizen_radio.click()

            driver.find_element(By.ID, "btnlogin").click()

            time.sleep(3)

            if "Dashboard" in driver.page_source:
                print("Login Successful")
                return True

        except Exception as exc:
            print(f"Login failed attempt {attempt+1}: {exc}")
            continue

        print(f"Login failed attempt {attempt+1}")

    return False