from scraper.driver import get_driver
from scraper.login import login

def main():
    driver = get_driver()

    success = login(driver)

    if not success:
        print("Login failed after 3 attempts.")
        return

    print("Phase 1 Complete")

if __name__ == "__main__":
    main()