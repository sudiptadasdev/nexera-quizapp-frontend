from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

# Load test user credentials
with open("selenium_tests/temp_user.txt", "r") as f:
    email, password = f.read().strip().split(",")

# Setup Edge driver
service = Service("selenium_tests/msedgedriver.exe")
driver = webdriver.Edge(service=service)
driver.maximize_window()  # ✅ Ensures dropdowns and navbar are visible

try:
    # Step 1: Login
    driver.get("http://localhost:3000/login")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "emailInput")))
    driver.find_element(By.ID, "emailInput").send_keys(email)
    driver.find_element(By.ID, "passwordInput").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Log In']").click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/"))
    print("✅ Logged in")
    time.sleep(1.5)

    # Step 2: Go to Generate Quiz via navbar
    quiz_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.LINK_TEXT, "Generate Quiz"))
    )
    quiz_link.click()
    WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/upload"))
    print("📂 Upload page loaded")
    time.sleep(1.5)

    # Step 3: Upload a sample file
    file_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//input[@type='file']"))
    )
    file_input.send_keys(os.path.abspath("selenium_tests/sample.pdf"))
    time.sleep(1)
    driver.find_element(By.XPATH, "//button[text()='Submit']").click()
    print("📤 File submitted")

    # Step 4: Wait for redirect to quiz page
    WebDriverWait(driver, 15).until(EC.url_contains("/quiz/"))
    print("✅ Quiz page loaded:", driver.current_url)
    time.sleep(2)

    # Step 5: Answer quiz questions
    questions = driver.find_elements(By.CSS_SELECTOR, ".quiz-page .border")

    for idx, q in enumerate(questions):
        try:
            option = q.find_element(By.CSS_SELECTOR, "input[type='radio']")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", option)
            time.sleep(1)
            driver.execute_script("arguments[0].click();", option)
            print(f"✅ Question {idx + 1}: MCQ answered")
        except:
            try:
                text_inputs = q.find_elements(By.CSS_SELECTOR, "input[type='text']")
                if text_inputs:
                    text_input = text_inputs[0]
                    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", text_input)
                    time.sleep(1)
                    text_input.send_keys("Test")
                    print(f"✅ Question {idx + 1}: Text answered")
                else:
                    print(f"⚠️ Question {idx + 1}: No input found")
            except Exception as inner_e:
                print(f"❌ Question {idx + 1}: Skipped due to error: {inner_e}")

    # Step 6: Submit quiz
    submit_btn = driver.find_element(By.XPATH, "//button[text()='Submit']")
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_btn)
    time.sleep(1)
    driver.execute_script("arguments[0].click();", submit_btn)
    print("📨 Quiz submitted")

    try:
        WebDriverWait(driver, 15).until(EC.url_contains("/results"))
        print("📊 Results page loaded")
        time.sleep(2)
        result_text = driver.find_element(By.TAG_NAME, "body").text
        print("📝 Result Summary:\n", result_text)
    except Exception as e:
        print("❌ Failed to load results page:", e)
        page_src = driver.page_source[:1000]
        print("🧪 First 1000 chars of current page:\n", page_src)

except Exception as e:
    print("❌ Test failed:", e)

finally:
    time.sleep(5)  # Final pause to view result before closing
    driver.quit()
