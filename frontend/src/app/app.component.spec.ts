import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {ToastModule} from "primeng/toast";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {AvailabilityModule} from "./library/components/availability/availability.module";
import {AppRoutingModule} from "./app-routing.module";
import {DashboardsModule} from "./library/dashboards/dashboards.module";
import {HttpClientModule} from "@angular/common/http";
import {PanelModule} from "primeng/panel";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {StyleClassModule} from "primeng/styleclass";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {CategoricalModule} from "./library/components/categorical/categorical.module";
import {KeyValueDisplayModule} from "./library/components/key-value-display/key-value-display.module";
import {RouterTestingModule} from "@angular/router/testing";
import {ApiModule} from "./generated/api.module";
import {environment} from "../environments/environment";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        AvailabilityModule,
        AppRoutingModule,
        DashboardsModule,
        HttpClientModule,
        PanelModule,
        CardModule,
        ButtonModule,
        DividerModule,
        StyleClassModule,
        ScrollPanelModule,
        CategoricalModule,
        KeyValueDisplayModule,
        ToastModule,
        RouterTestingModule,
        ApiModule.forRoot({rootUrl: environment.api})
      ],
      providers: [],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'dip'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('dip');
  });
});
