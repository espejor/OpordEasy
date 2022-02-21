import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor (){
    // this.setAppLanguage();
  }
  // setAppLanguage() {
  //   this.translate.setDefaultLang('en');
  //   this.translate.use(<string>this.translate.getBrowserLang());
  // }

  title = 'OpordEasyApp'; 
  showFiller = false;
}
