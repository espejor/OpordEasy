import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconRegisterService {

constructor(private matIconRegister?:MatIconRegistry, private sanitizer?:DomSanitizer ) {}
  public register(nameIcon:string,svgIconPath:string){
    this.matIconRegister.addSvgIcon(nameIcon, this.sanitizer.bypassSecurityTrustResourceUrl(svgIconPath))
  }
}
