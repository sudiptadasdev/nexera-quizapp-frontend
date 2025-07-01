from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

# Set up Edge driver
service = Service("./selenium_tests/msedgedriver.exe")
driver = webdriver.Edge(service=service)

try:
    # Open the registration page
    driver.get("http://localhost:3000/signup")

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "card-title"))
    )

    rand_num = random.randint(1000, 99999)
    unique_email = f"john.doe{rand_num}@example.com"

    # Fill registration form
    driver.find_element(By.XPATH, "//label[text()='Full Name']/following-sibling::input").send_keys("John Doe")
    driver.find_element(By.XPATH, "//label[text()='Email']/following-sibling::input").send_keys(unique_email)
    driver.find_element(By.XPATH, "//label[text()='Password']/following-sibling::input").send_keys("MySecurePass123")
    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    WebDriverWait(driver, 10).until(
        EC.url_contains("/login")
    )

    print(f"✅ Registration test passed with email: {unique_email}")

    # Save credentials
    with open("selenium_tests/temp_user.txt", "w") as f:
        f.write(f"{unique_email},MySecurePass123")

except Exception as e:
    print("❌ Test failed:", e)

finally:
    time.sleep(2)
    driver.quit()
