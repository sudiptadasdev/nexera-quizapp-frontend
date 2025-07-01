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
driver.maximize_window()  # ✅ Expand window to full screen

try:
    # Step 1: Login
    driver.get("http://localhost:3000/login")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "emailInput")))
    driver.find_element(By.ID, "emailInput").send_keys(email)
    driver.find_element(By.ID, "passwordInput").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Log In']").click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/"))
    print("✅ Logged in")

    # Step 2: Ensure Dashboard is visible
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//a[text()='Dashboard']"))
    )
    print("🏠 Dashboard loaded")
    time.sleep(1)

    # Step 3: Open avatar dropdown → click "View Profile"
    avatar = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "user-menu")))
    driver.execute_script("arguments[0].click();", avatar)
    time.sleep(0.5)
    view_profile = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[text()='View Profile']"))
    )
    view_profile.click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/profile/view"))
    print("👁️ View Profile page loaded")

    # Step 4: Again open dropdown → click "Quiz History"
    avatar = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "user-menu")))
    driver.execute_script("arguments[0].click();", avatar)
    time.sleep(0.5)
    history_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[text()='Quiz History']"))
    )
    history_link.click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/history"))
    print("📜 Quiz History page loaded")

    # Step 5: Verify content
    page_text = driver.find_element(By.TAG_NAME, "body").text.lower()
    if "quiz" in page_text and ("attempt" in page_text or "score" in page_text):
        print("✅ History content confirmed")
    else:
        print("⚠️ History loaded but content not detected")

except Exception as e:
    print("❌ Test failed:", e)
    print("🔍 HTML Preview:\n", driver.page_source[:1000])

finally:
    time.sleep(5)
    driver.quit()
