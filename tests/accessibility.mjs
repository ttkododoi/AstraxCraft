import {chromium} from 'playwright';
import {options} from '../tools/browser-runtime.mjs';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch(await options()),context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),results=[];
try {
 await page.goto('http://localhost:8080/');await page.locator('#startup').waitFor({state:'detached'});await page.emulateMedia({reducedMotion:'reduce'});
 for(const target of ['Game','Launcher Settings','Downloads']) {
  await page.getByRole('button',{name:target,exact:true}).click();if(target==='Game')await page.locator('.quiet-home').waitFor();else await page.getByRole('heading',{name:target,exact:true}).waitFor();await page.waitForFunction(()=>!document.querySelector('#content').inert);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  results.push({page:target,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({html:n.html,failureSummary:n.failureSummary}))}))});
 }
 await page.getByRole('button',{name:'Game',exact:true}).click();await page.locator('#version').click();
 const picker=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();results.push({page:'Picker',violations:picker.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,failureSummary:n.failureSummary}))}))});
 for(const r of results)console.log(r.page,JSON.stringify(r.violations));
 assert(results.every(r=>r.violations.length===0),'Automated accessibility violations found');
} finally {await fs.writeFile('verification/accessibility-results.json',JSON.stringify(results,null,2));await browser.close();}
