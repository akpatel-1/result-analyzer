from dotenv import load_dotenv
import os

load_dotenv()

LOGIN_ID = os.getenv("LOGIN_ID")
PASSWORD = os.getenv("PASSWORD")
LOGIN_URL = os.getenv('LOGIN_URL')