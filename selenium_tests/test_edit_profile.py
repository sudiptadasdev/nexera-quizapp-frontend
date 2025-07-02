from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

# Load credentials
with open("selenium_tests/temp_user.txt", "r") as f:
    email, password = f.read().strip().split(",")

service = Service("selenium_tests/msedgedriver.exe")
driver = webdriver.Edge(service=service)
driver.maximize_window()

try:
    # Step 1: Login
    driver.get("http://localhost:3000/login")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "emailInput")))
    driver.find_element(By.ID, "emailInput").send_keys(email)
    driver.find_element(By.ID, "passwordInput").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Log In']").click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/"))
    print("✅ Logged in")
    time.sleep(2)

    # Step 2: Go to View Profile
    avatar = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "user-menu")))
    driver.execute_script("arguments[0].click();", avatar)
    time.sleep(1)
    view_profile = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[text()='View Profile']"))
    )
    view_profile.click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/profile/view"))
    print("👁️ View Profile page loaded")
    time.sleep(2)

    # Step 3: Go to Edit Profile
    avatar = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "user-menu")))
    driver.execute_script("arguments[0].click();", avatar)
    time.sleep(1)
    edit_profile = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[text()='Edit Profile']"))
    )
    edit_profile.click()
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h4[text()='Edit Your Information']"))
    )
    print("Edit Profile page loaded")
    time.sleep(2)

    # Step 4: Update inputs
    rand_suffix = random.randint(100, 999)
    new_name = f"TestUser{rand_suffix}"
    new_bio = f"Selenium test run #{rand_suffix}"

    name_input = driver.find_element(By.XPATH, "//input[@placeholder='Enter your full name']")
    bio_input = driver.find_element(By.XPATH, "//textarea[@placeholder='Write something about yourself']")
    name_input.clear()
    time.sleep(1)
    name_input.send_keys(new_name)
    time.sleep(1)
    bio_input.clear()
    time.sleep(1)
    bio_input.send_keys(new_bio)
    time.sleep(2)

    # Step 5: Submit form
    submit_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Update Profile')]")
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_btn)
    time.sleep(1)
    driver.execute_script("arguments[0].click();", submit_btn)
    print("Submitted profile update")

    # Step 6: Redirect and verify
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/profile/view"))
    print(" Redirected to View Profile")
    time.sleep(2)

    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert new_name in body_text and new_bio in body_text
    print("Profile update verified")

except Exception as e:
    print("Test failed:", e)

finally:
    time.sleep(5)
    driver.quit()
