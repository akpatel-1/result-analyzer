from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse


def build_roll_url(base_url, roll_number):
    parsed = urlparse(base_url)
    params = dict(parse_qsl(parsed.query, keep_blank_values=True))
    params["R"] = str(roll_number)

    updated_query = urlencode(params)
    return urlunparse(parsed._replace(query=updated_query))


def open_result_page(driver, url):
    driver.get(url)