import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo-app';
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'sp']);
    //translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|sp/) ? browserLang : 'en');
    if(localStorage['keyChange1']){
    }else{
      localStorage.clear();
      localStorage.setItem('keyChange1', 'true');
    }
  }
}
