import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  getLogout(){
    return element(by.css('#logoutBtn')).isDisplayed();
  }

  login(){
    element(by.id('email')).sendKeys('mail@mail.dk');
    element(by.id('password')).sendKeys('qwerty');
    element(by.id('loginSubmit')).click();
  }

  clickLogout(){
    element(by.css(".addPoint")).click();
  }

  navigateToLogin(){
    return browser.get('/login');
  }
}
