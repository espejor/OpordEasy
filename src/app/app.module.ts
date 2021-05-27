import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { NavComponent } from './components/nav/nav.component';
import { OlMapComponent } from './components/nav/ol-map/ol-map.component';
import { HeaderComponent } from './components/header/header.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routing } from './app.routing';
import { TranslationComponent } from './components/translation/translation.component';
import { OperationsComponent } from './components/nav/operations/operations.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule }  from '@angular/material/select';
import { UnitSelectorComponent } from './components/unit-selector/unit-selector.component';
import { UnitSelectorDialogLoaderComponent } from './components/unit-selector-dialog-loader/unit-selector-dialog-loader.component';
import { PointSelectorDialogLoaderComponent } from './components/point-selector-dialog-loader/point-selector-dialog-loader.component';
import { PointSelectorComponent } from './components/point-selector/point-selector.component';
import { FloatingButtonsComponent } from './components/nav/floating-buttons/floating-buttons.component';

export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    OlMapComponent,
    HeaderComponent,
    TranslationComponent,
    OperationsComponent,
    UnitSelectorComponent,
    UnitSelectorDialogLoaderComponent,
    PointSelectorComponent,
    PointSelectorDialogLoaderComponent,
    FloatingButtonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSliderModule,
    MatCardModule,
    MatSnackBarModule,
    MatSelectModule,
    HttpClientModule,
    // routing,
    // RouterModule.forRoot(routing),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  exports: [
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatSliderModule
  ],
  providers: [
  //   {
  //   provide: MatSnackBar,
  //   useValue: {}
  // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

