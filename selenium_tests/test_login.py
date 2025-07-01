from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Load the registered user credentials
with open("selenium_tests/temp_user.txt", "r") as f:
    email, password = f.read().strip().split(",")

# Set up Edge driver
service = Service("selenium_tests/msedgedriver.exe")
driver = webdriver.Edge(service=service)

try:
    # Open the login page
    driver.get("http://localhost:3000/login")

    # Wait for the login form to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "card-title"))
    )

    # Fill in Email and Password
    driver.find_element(By.ID, "emailInput").send_keys(email)
    driver.find_element(By.ID, "passwordInput").send_keys(password)

    # Click Login
    driver.find_element(By.XPATH, "//button[text()='Log In']").click()

    # Wait for redirect (assuming it goes to dashboard at `/`)
    WebDriverWait(driver, 10).until(
        EC.url_matches("http://localhost:3000/")  # or use EC.url_contains("/") if needed
    )

    print(f"Login test passed for email: {email}")

except Exception as e:
    print("Login test failed:", e)

finally:
    time.sleep(10)
    driver.quit()
