import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';
//import { element } from '@angular/core/src/render3';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('1.0: Login as user and logout', () => {
    browser.get('/login');
    page.login();
    browser.sleep(2000);
    var displayed = element(by.id('mapBody')).isDisplayed();
    expect(displayed).toEqual(true);
    
  });

});
