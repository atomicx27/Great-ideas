const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.route('**/*.{png,jpg,jpeg,webp,svg,gif,woff,woff2,ttf,otf}', route => route.abort());
  await page.route('**/*font-awesome*', route => route.abort());

  const projects = [
      'Automated-Traffic-Light-Controller',
      'Agentic-Autonomous-Vehicle',
      'AGI-Smart-City-Traffic-Orchestrator',
      'Automated-Irrigation-System',
      'Agentic-Crop-Disease-Specialist',
      'AGI-Global-Food-Security-Orchestrator'
  ];

  for (const project of projects) {
      console.log(`Taking screenshot for ${project}...`);
      await page.goto(`http://localhost:8080/${project}/index.html`, { waitUntil: 'commit' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${project}_screenshot.png`, fullPage: true });
  }

  await browser.close();
  console.log('Screenshots captured.');
})();
