const puppeteer = require('puppeteer');
const cookies = require('./icloud-cookie');
const {
  createActiveMail,
  getActiveMailNotBlocked,
} = require('../mongoose/service/active-mails');
require('../mongoose/db');
const MAX_MAIL_NUMBER = 5;
class ICloudAgent {
  async cloudTask() {
    console.log(global._taskOnRun);
    if (global._taskOnRun) {
      console.log('New Task not running due to another not finish.');
      return;
    }

    try {
      global._taskOnRun = true;
      const total = await getActiveMailNotBlocked();
      console.info('Cloud agent run successfully.');

      if (total.length <= MAX_MAIL_NUMBER) {
        const loopIteration = MAX_MAIL_NUMBER - Number(total.length);

        let loopArr = [];

        for (let i = 0; i < loopIteration; i++) {
          loopArr.push(i);
        }

        for (var item of loopArr) {
          await this._openICloudPage();

          if (item === loopArr.length - 1) {
            global._taskOnRun = false;
          }
        }
      } else {
        console.log('Enough mail.');
        global._taskOnRun = false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * This section is main for create new email. Starting in icloud settings page then
   * select options under the hide my emials section. Click this button and create
   * temporary mail.
   * @returns
   */
  async _openICloudPage() {
    const browser = await puppeteer.launch({
      headless: true,
      // userDataDir: datadir,
      devtools: true,
    });
    const page = await browser.newPage();
    await page.setCookie(...cookies);

    const res = await page.goto('https://www.icloud.com/settings/');

    this._sleep(10000);

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

    const number = Math.floor(Math.random() * (1000 + 1));

    await mailFrame.type('.AddEmail-inputsRow > div > input', `fb${number}`);

    this._sleep(3000);

    await mailFrame.waitForSelector('.GeneratedEmail');

    const complateBtn = await mailFrame.$(
      'nav[class="button-bar-nav"] > div:nth-child(2)'
    );

    await complateBtn.click();

    this._sleep(10000);

    const mail = await mailFrame.evaluate(() => {
      let value = document.querySelector(
        'div[class="EmailDetail-detailsRow"] > div > p'
      ).innerText;

      return value;
    });

    await createActiveMail(mail);

    if (mail) {
      await browser.close();
    }
    return res;
  }

  // TODO Clear used mails
  async _clearUsedMais() {}

  _sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
}

module.exports = ICloudAgent;
