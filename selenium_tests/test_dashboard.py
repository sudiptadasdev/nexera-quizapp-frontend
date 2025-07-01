from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Load credentials
with open("selenium_tests/temp_user.txt", "r") as f:
    email, password = f.read().strip().split(",")

service = Service("selenium_tests/msedgedriver.exe")
driver = webdriver.Edge(service=service)

try:
    # Step 1: Login
    driver.get("http://localhost:3000/login")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "emailInput")))
    driver.find_element(By.ID, "emailInput").send_keys(email)
    driver.find_element(By.ID, "passwordInput").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Log In']").click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/"))
    print("✅ Logged in and reached dashboard")

    # Step 2: Wait for file cards to appear
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".cursor-pointer"))
    )
    print("File cards found")

    # Step 3: Click first file card
    first_card = driver.find_elements(By.CSS_SELECTOR, ".cursor-pointer")[0]
    driver.execute_script("arguments[0].scrollIntoView(true);", first_card)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", first_card)
    print("📄 Clicked first file card")

    # Step 4: Wait for quiz sections table to appear (but don't click Take Quiz)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//table//button[text()='Take Quiz']"))
    )
    print("Quiz section table loaded — test ends here without taking quiz.")

except Exception as e:
    print("Test failed:", e)

finally:
    time.sleep(5)
    driver.quit()
