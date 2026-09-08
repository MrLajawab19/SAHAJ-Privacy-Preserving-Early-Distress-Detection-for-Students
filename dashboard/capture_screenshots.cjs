const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const VIEWS = [
  { id: 'federated-results', name: '01_federated_results', btnText: 'Federated Results' },
  { id: 'longitudinal-analysis', name: '02_longitudinal_analysis', btnText: 'Longitudinal Analysis' },
  { id: 'non-iid-distribution', name: '03_noniid_distribution', btnText: 'Non-IID Distribution' },
  { id: 'architecture-diagram', name: '04_architecture_diagram', btnText: 'Architecture Diagram' },
  { id: 'federated-workflow', name: '05_federated_workflow', btnText: 'Federated Workflow' }
];

async function captureScreenshots() {
  const screenshotsDir = path.join(__dirname, '..', 'results', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 }
  });
  
  const page = await context.newPage();

  console.log('Navigating to local dashboard...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  } catch (err) {
    console.error('Failed to navigate to http://localhost:5173. Make sure the dev server is running!');
    await browser.close();
    process.exit(1);
  }

  // Ensure data is loaded
  await page.waitForSelector('main', { state: 'visible' });

  const summary = [];

  for (const view of VIEWS) {
    console.log(`Processing view: ${view.btnText}...`);
    
    // Click the sidebar button corresponding to the view
    await page.getByRole('button', { name: view.btnText }).click();
    
    // Wait for animations and charts to render
    await page.waitForTimeout(1000); 

    // Target the main content area to exclude the sidebar
    const mainElement = page.locator('main');
    
    // Ensure the main content area has rendered
    await mainElement.waitFor({ state: 'visible' });

    const filePath = path.join(screenshotsDir, `${view.name}.png`);
    
    // Take a screenshot of just the main content
    await mainElement.screenshot({ path: filePath });
    
    // Get dimensions of the screenshot
    const box = await mainElement.boundingBox();
    summary.push({
      file: `${view.name}.png`,
      width: Math.round(box.width),
      height: Math.round(box.height)
    });
    
    console.log(`Saved: ${filePath}`);
  }

  await browser.close();

  console.log('\n========================================');
  console.log(' SCREENSHOT SUMMARY');
  console.log('========================================');
  summary.forEach(s => {
    console.log(`- ${s.file}  [${s.width}x${s.height}]`);
  });
  console.log('========================================\n');
}

captureScreenshots().catch(err => {
  console.error("Error during screenshot capture:", err);
  process.exit(1);
});
