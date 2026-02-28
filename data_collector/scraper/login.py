import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config.settings import LOGIN_ID, PASSWORD, LOGIN_URL
from scraper.captcha_solver import solve_captcha

def login(driver):
    driver.get(LOGIN_URL)

    wait = WebDriverWait(driver, 10)

    # Click Student Login
    student_btn = wait.until(
    EC.element_to_be_clickable(
        (By.XPATH, "//p[normalize-space()='Student Login']")
    ))
    student_btn.click()

    for attempt in range(5):
        try:
            # Fill login ID
            driver.find_element(By.ID, "LoginID").send_keys(LOGIN_ID)

            # Fill password
            driver.find_element(By.ID, "Password").send_keys(PASSWORD)

            # Capture captcha image
            captcha_img = driver.find_element(By.XPATH, "//img[contains(@src,'GetCaptcha')]")
            captcha_img.screenshot("data/screenshots/captcha.png")

            captcha_text = solve_captcha("data/screenshots/captcha.png")

            driver.find_element(By.ID, "captcha").send_keys(captcha_text)

            # Select Student radio
            driver.find_element(By.XPATH, "//input[@value='Citizen']").click()

            # Click login
            driver.find_element(By.ID, "btnlogin").click()

            time.sleep(3)

            if "Dashboard" in driver.page_source:
                print("Login Successful")
                return True

        except Exception:
            pass

        print(f"Login failed attempt {attempt+1}")

    driver.quit()
    return False