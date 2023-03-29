const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path')
async function run() {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] });
    await page.goto("https://cogoport.onepercentstartups.com/");
    await page.evaluate(() => {
        localStorage.setItem('cogoportKey', '{"expiresIn":"5h","Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY2LCJyb2xlIjoiU1RVREVOVCIsImlhdCI6MTY3ODk2NTAyOCwiZXhwIjoxNjc4OTgzMDI4fQ.5eQ4_Hz4F9txN1MHS2aJIZkeE9hc8DAUBCzIaW5PykQ","data":{"id":166,"fullName":"S. Sai Tarun","email":"Sanagapati.Tarun@cogoport.com","githubUsername":"saitaruns1","batchId":3,"streamId":1,"role":"STUDENT","last_reset_password":null,"last_login":null,"createdAt":"2023-02-13T12:55:23.128Z","updatedAt":"2023-02-13T12:55:23.128Z"}}');
    });
    await page.goto('https://cogoport.onepercentstartups.com/landing');

    const unitHandles = await page.$$(".px-5.py-2.my-1.rounded-md.cursor-pointer");

    // for (let i = 0; i < unitHandles.length; i++) {
    let i = 0;
    const unitHandle = unitHandles[i];
    const unitTitle = await page.evaluate(el => el.textContent, unitHandle);
    await page.waitForSelector(".px-5.py-2.my-1.rounded-md.cursor-pointer");
    await page.waitForTimeout(3000);
    await page.evaluate(async (i) => await document.querySelectorAll(".px-5.py-2.my-1.rounded-md.cursor-pointer")[i].click(), i);


    const sectionHandles = await page.$$(".flex.flex-col.w-full.pl-2")
    for (let j = 0; j < sectionHandles.length; j++) {
        await page.waitForTimeout(3000);
        await page.evaluate(async (i) => await document.querySelectorAll(".px-5.py-2.my-1.rounded-md.cursor-pointer")[i].click(), i);

        sectionHandle = sectionHandles[j];
        if (sectionHandle) {

            var sectionTitle = await page.evaluate(el => el.textContent, sectionHandle);
            sectionTitle = sectionTitle.replace(/[^a-z]/gi, '');

            await page.waitForTimeout(3000);
            await page.evaluate(async (j) => {
                await document.querySelectorAll(".flex.flex-col.w-full.pl-2")[j].click()
            }, j);



            await page.waitForSelector(".inline-flex.items-center.rounded-3xl.border.border-transparent");
            await page.waitForTimeout(3000);
            const btnHandle = await page.$(".inline-flex.items-center.rounded-3xl.border.border-transparent");

            var btnText = await page.evaluate(el => el.textContent, btnHandle);



            await btnHandle.evaluate(async b => await b.click());



            await page.waitForTimeout(3000);
            const leftHandles = await page.$$(".flex.justify-between.items-start.flex-1.text-sm.mb-1");
            const realLeftHandles = [];

            for (let k = 0; k < leftHandles.length / 2; k++) {
                realLeftHandles.push(leftHandles[k]);
            }

            for (let k = 0; k < realLeftHandles.length; k++) {
                let leftText = await page.evaluate(el => el.textContent, leftHandles[k]);
                leftText = leftText.replace(/[^a-z]/gi, '');
                await page.evaluate((l) => { l.click() }, realLeftHandles[k])
                await page.waitForTimeout(3000);

                const pageContent = await page.evaluate(() => {
                    const ele = document.querySelector('#scroller')
                    if (ele) {
                        return ele.outerHTML;
                    }
                });

                const folderUnit = path.resolve(__dirname, unitTitle)
                try {
                    if (!fs.existsSync(folderUnit)) {
                        fs.mkdirSync(folderUnit);
                    }
                    const folderSection = path.resolve(__dirname, unitTitle, sectionTitle)
                    try {
                        if (!fs.existsSync(folderSection)) {
                            fs.mkdirSync(folderSection);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                } catch (err) {
                    console.error(err);
                }
                const URL = path.resolve(__dirname, unitTitle, sectionTitle, leftText + ".html");
                console.log(URL);


                if (pageContent) {
                    fs.appendFile(URL, pageContent, () => {
                        console.log("saved succesfully");
                    })
                }


            }



            await page.waitForTimeout(3000);
            await page.goBack();
        }



    }
}

// }
run();
