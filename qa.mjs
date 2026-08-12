import { chromium } from 'playwright';

(async () => {
  console.log("Starting QA test with Playwright for hugCoach (static MVP)...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`Visited MVP Homepage. Title: ${title}`);
    
    const hasForm = await page.evaluate(() => document.querySelector('form') !== null);
    if (hasForm) {
      console.log("Found check-in form.");
    } else {
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 50));
      console.log(`No form found. Page starts with: ${bodyText}`);
    }

    await page.waitForTimeout(1000);
    
    console.log("\n--- QA Results ---");
    if (errors.length > 0) {
      console.log("Encountered errors during QA:");
      errors.forEach(e => console.log(e));
    } else {
      console.log("No console or page errors encountered! MVP is solid.");
    }
    
  } catch (err) {
    console.error("Test failed to execute:", err);
  } finally {
    await browser.close();
  }
})();
