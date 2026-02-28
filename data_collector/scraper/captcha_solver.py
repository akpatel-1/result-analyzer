import cv2
import pytesseract
import numpy as np

def solve_captcha(image_path):
    img = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply threshold
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    # Optional: resize (improves OCR accuracy)
    thresh = cv2.resize(thresh, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)

    # Remove small noise
    kernel = np.ones((2,2), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # OCR config
    config = r'--psm 8 -c tessedit_char_whitelist=abcdefghijklmnopqrstuvwxyz0123456789'

    text = pytesseract.image_to_string(thresh, config=config)

    return text.strip()