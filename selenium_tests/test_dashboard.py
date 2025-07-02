from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import datetime

def take_screenshot(tag="error"):
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    driver.save_screenshot(f"selenium_tests/{tag}_{timestamp}.png")

# Setup
service = Service("selenium_tests/msedgedriver.exe")
driver = webdriver.Edge(service=service)
driver.maximize_window()

try:
    # Login
    driver.get("http://localhost:3000/login")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "emailInput")))
    with open("selenium_tests/temp_user.txt", "r") as f:
        email, password = f.read().strip().split(",")
    driver.find_element(By.ID, "emailInput").send_keys(email)
    driver.find_element(By.ID, "passwordInput").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Log In']").click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/"))
    print("✅ Logged in and reached dashboard")

    # Wait and find file cards
    cards = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".cursor-pointer"))
    )
    print("📁 File cards found:", len(cards))

    # Hover over the first card and click it
    first_card = cards[0]
    actions = ActionChains(driver)
    actions.move_to_element(first_card).pause(1.5).click().perform()
    print("🖱️ Hovered and clicked the first file card")

    # Wait for any expected UI update (change this selector based on actual page)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".table, .history-title, .attempt-card"))
    )
    print("📊 Quiz history section appeared")

    time.sleep(4)  # Let you visually verify change before closing

except Exception as e:
    print("❌ Test failed with error:", e)
    take_screenshot("dashboard_failure")

finally:
    time.sleep(3)
    driver.quit()
