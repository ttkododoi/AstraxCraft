// Existing runner-focused regressions explicitly exercise the separate-window fallback.
// Default hosted same-page behavior is covered independently in player.mjs/featured.mjs.
export async function launchSeparate(page,control=page.locator('#launch')){await control.click();if(await page.locator('#inlinePlayer').count())await page.getByRole('button',{name:'Open separately',exact:true}).click();}
