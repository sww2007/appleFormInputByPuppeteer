import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req, res) {
  try {
    const [page, browser] = await openBrowser();
    await loginSample(page);
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }

  return NextResponse.json({ message: "Hello World" });
}

const loginSample = async (page) => {
  const loginId = "sampleID";
  const loginPW = "samplePW";

  //ログインページにはgetの引数が必要なのでトップページから遷移していく
  await page.goto("https://www.apple.com/jp/");

  //.globalnav-bag-wrapperの要素が表示されるまで待つ
  await page.waitForSelector(".globalnav-bag-wrapper", { visible: true });

  //.globalnav-bag-wrapperの要素をクリック
  await page.click(".globalnav-bag-wrapper");

  // data-analytics-title="account"の読み込みを待つ
  await page.waitForSelector('[data-analytics-title="account"]', { visible: true });

  // data-analytics-title="account"の要素をクリック
  await page.click('[data-analytics-title="account"]');

  //iframe name="aid-auth-widget"の読み込みを待つ
  const iframeElement = await page.waitForSelector('iframe[name="aid-auth-widget"]');

  //iframeを取得
  const frame = await iframeElement.contentFrame();

  //iframe内のinput#account_name_text_fieldが表示されるまで待つ
  await frame.waitForSelector("input#account_name_text_field", { visible: true });

  //input#account_name_text_fieldにloginIdを入力
  await frame.type("input#account_name_text_field", loginId);

  // #sign-in　をクリック
  await frame.click("#sign-in");

  //#password_text_fieldの読み込みを待つ
  await frame.waitForSelector("#password_text_field", { visible: true });

  //#password_text_fieldにloginPWを入力
  await frame.type("#password_text_field", loginPW);

  //#sign-inの読み込みを待つ
  await frame.waitForSelector("#sign-in", { visible: true });

  //#sign-in　をクリック
  await frame.click("#sign-in");
};

const openBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    //headless: "new",
    args: ["--window-size=1280,1000", "--window-position=0,0", "--no-sandbox", "--disable-setuid-sandbox"],
    //  slowMo: 30,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1080 });

  //pageとbrowserを返す
  return [page, browser];
};
