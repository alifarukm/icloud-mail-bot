const puppeteer = require('puppeteer');
const cookies = require('./icloud-cookie');

class ICloudAgent {
  async openICloudPage() {
    const browser = await puppeteer.launch({
      headless: false,
      // userDataDir: datadir,
      devtools: true,
    });
    const page = await browser.newPage();
    await page.setCookie(...cookies);

    const res = await page.goto('https://www.icloud.com/settings/');

    this.sleep(10000);

    await page.waitForSelector('iframe#settings');

    const settingFrame = await page.$("iframe[id='settings']");

    const settingContent = await settingFrame.contentFrame();

    await settingContent.waitForSelector('.settings-button');

    const loginInput = await settingContent.$('.settings-button');

    const settingBtn = await settingContent.$(
      `div[aria-labelledby="private-email-addresses-title"] > div > table > tbody > tr:last-child > td > div`
    );

    await settingBtn.click();

    const mailFrame = settingContent.childFrames()[0];

    await mailFrame.waitForSelector('.HmeEmailList');

    const addMailBtn = await mailFrame.$(
      `div[class="HmeEmailList"] > div > div`
    );

    await addMailBtn.click();

    await mailFrame.waitForSelector('.GeneratedEmail');

    await mailFrame.type('.AddEmail-inputsRow > div > input', 'deneme3');

    this.sleep(3000);

    await mailFrame.waitForSelector('.GeneratedEmail');

    const complateBtn = await mailFrame.$(
      'nav[class="button-bar-nav"] > div:nth-child(2)'
    );

    await complateBtn.click();

    this.sleep(10000);

    const mail = await mailFrame.evaluate(() => {
      let value = document.querySelector(
        'div[class="EmailDetail-detailsRow"] > div > p'
      ).innerText;

      return value;
    });

    // todo send mail to mongoose

    return res;
  }

  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
}

module.exports = ICloudAgent;
