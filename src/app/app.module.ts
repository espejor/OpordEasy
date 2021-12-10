import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { NavComponent } from './components/nav/nav.component';
import { OlMapComponent } from './components/nav/ol-map/ol-map.component';
import { HeaderComponent } from './components/header/header.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationComponent } from './components/translation/translation.component';
import { OperationsComponent } from './components/nav/operations/operations.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule }  from '@angular/material/select';
import { UnitSelectorComponent } from './components/unit-selector/unit-selector.component';
import { UnitSelectorDialogLoaderComponent } from './components/unit-selector-dialog-loader/unit-selector-dialog-loader.component';
import { PointSelectorDialogLoaderComponent } from './components/point-selector-dialog-loader/point-selector-dialog-loader.component';
import { PointSelectorComponent } from './components/point-selector/point-selector.component';
import { FloatingButtonsComponent } from './components/nav/floating-buttons/floating-buttons.component';
import { TimelineComponent } from './components/nav/timeline/timeline.component';
import { FloatingMenuComponent } from './components/nav/floating-menu/floating-menu.component';
import { GhostElementComponent } from './components/nav/ghost-element/ghost-element.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EntityInTimelineComponent } from './components/nav/entity-in-timeline/entity-in-timeline.component';
import { FavoriteSelectorComponent } from './components/nav/favorite-selector/favorite-selector.component';
import { EntityUnitSelectorCardComponent } from './components/nav/entity-unit-selector-card/entity-unit-selector-card.component';
import { RecentSelectorComponent } from './components/nav/recent-selector/recent-selector.component';
import { PhaseComponent } from './components/nav/phase/phase.component';
import { GlobalsService } from './services/globals.service';
import { NewPhaseDialogComponent } from './components/nav/ol-map/new-phase-dialog/new-phase-dialog.component';
import { LineSelectorDialogLoaderComponent } from './components/line-selector-dialog-loader/line-selector-dialog-loader.component';
import { LineSelectorComponent } from './components/line-selector/line-selector.component';
import { AreaSelectorComponent } from './components/area-selector/area-selector.component';
import { AreaSelectorDialogLoaderComponent } from './components/area-selector-dialog-loader/area-selector-dialog-loader.component';


export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http);
}

export let AppInjector: Injector;

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
    FloatingButtonsComponent,
    TimelineComponent,
    FloatingMenuComponent,
    GhostElementComponent,
    EntityInTimelineComponent,
    FavoriteSelectorComponent,
    EntityUnitSelectorCardComponent,
    RecentSelectorComponent,
    PhaseComponent,
    NewPhaseDialogComponent,
    LineSelectorDialogLoaderComponent,
    LineSelectorComponent,
    AreaSelectorDialogLoaderComponent,
    AreaSelectorComponent
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
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSliderModule,
    MatCardModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTabsModule,
    HttpClientModule,
    DragDropModule,
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
    GlobalsService
  //   {
  //   provide: MatSnackBar,
  //   useValue: {}
  // },
  ],
  bootstrap: [AppComponent]
})

    
export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}

