from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

# Load login credentials
with open("selenium_tests/temp_user.txt", "r") as f:
    email, password = f.read().strip().split(",")

# Launch Edge browser
service = Service("selenium_tests/msedgedriver.exe")
driver = webdriver.Edge(service=service)
driver.maximize_window()  # ✅ Ensure dropdowns are visible

try:
    # Step 1: Login
    driver.get("http://localhost:3000/login")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "emailInput")))
    driver.find_element(By.ID, "emailInput").send_keys(email)
    driver.find_element(By.ID, "passwordInput").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Log In']").click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/"))
    print("✅ Logged in")

    # Step 2: Go to View Profile via dropdown
    avatar = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "user-menu")))
    driver.execute_script("arguments[0].click();", avatar)
    time.sleep(0.5)
    view_profile = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[text()='View Profile']"))
    )
    view_profile.click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/profile/view"))
    print("👁️ View Profile page loaded")

    # Step 3: Open avatar dropdown again and go to Edit Profile
    avatar = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "user-menu")))
    driver.execute_script("arguments[0].click();", avatar)
    time.sleep(0.5)
    edit_profile = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[text()='Edit Profile']"))
    )
    edit_profile.click()
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h2[text()='Profile Settings']"))
    )
    print("✏️ Edit Profile page loaded")

    # Step 4: Update form fields
    rand_suffix = random.randint(100, 999)
    new_name = f"TestUser{rand_suffix}"
    new_bio = f"Hello from Selenium test #{rand_suffix}"

    name_input = driver.find_element(By.XPATH, "//label[text()='Full Name']/following-sibling::input")
    bio_input = driver.find_element(By.XPATH, "//label[text()='About You']/following-sibling::textarea")
    name_input.clear()
    name_input.send_keys(new_name)
    bio_input.clear()
    bio_input.send_keys(new_bio)
    time.sleep(1)

    driver.find_element(By.XPATH, "//button[text()='Update Profile']").click()
    print("✅ Submitted profile update")

    # Step 5: Handle alert if any
    try:
        WebDriverWait(driver, 5).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        print("📢 Alert Text:", alert.text)
        alert.accept()
    except:
        print("ℹ️ No alert appeared")

    # Step 6: Redirect and verify
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/profile/view"))
    print("🔁 Redirected to View Profile")

    time.sleep(1)
    page_text = driver.find_element(By.TAG_NAME, "body").text
    assert new_name in page_text and new_bio in page_text
    print("✅ Profile update verified!")

except Exception as e:
    print("❌ Test failed:", e)

finally:
    time.sleep(3)
    driver.quit()
