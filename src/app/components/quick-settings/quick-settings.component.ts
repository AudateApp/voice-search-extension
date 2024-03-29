import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  LocaleProperties,
  LocalesForDefaultModel,
  DefaultLocale,
} from 'src/app/services/locale/locale-properties';
import {
  DefaultSearchEngine,
  SearchEngine,
  SearchEngines,
} from 'src/app/model/search-engine';
import { InputDeviceService } from 'src/app/services/input-device.service';
import { LocaleService } from 'src/app/services/locale/locale.service';
import { SearchEngineService } from 'src/app/services/search-engine.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { Logger } from 'src/app/services/logging/logger';
import {
  LaunchTarget,
  DefaultLaunchTarget,
  LaunchTargetService,
} from 'src/app/services/launch-target.service';
import { I18nService } from 'src/app/services/i18n.service';
import { Mssg } from 'src/app/services/i18n-mssg';

@Component({
  selector: 'audate-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss'],
})
export class QuickSettingsComponent implements OnInit {
  logger: Logger;
  locales: LocaleProperties[] = LocalesForDefaultModel;
  currentLocale: LocaleProperties = DefaultLocale;
  launchTarget: string;
  Mssg = Mssg;

  searchEngines: SearchEngine[] = SearchEngines;
  currentSearchEngine: SearchEngine = DefaultSearchEngine;

  inputDevices: MediaDeviceInfo[] = [];
  currentInputDevice?: MediaDeviceInfo;
  NO_DEFAULT_INPUT_DEVICE: MediaDeviceInfo;

  activeSection: string = 'quick-settings';

  constructor(
    private localeService: LocaleService,
    private searchEngineService: SearchEngineService,
    private inputDeviceService: InputDeviceService,
    private launchTargetService: LaunchTargetService,
    protected i18n: I18nService,
    private ref: ChangeDetectorRef,
    loggingService: LoggingService
  ) {
    this.logger = loggingService.getLogger('quick-settings');
    this.NO_DEFAULT_INPUT_DEVICE = {
      label: i18n.get(Mssg.QsNoDefaultInput),
      kind: 'audioinput',
      groupId: '',
      deviceId: '',
      toJSON: function () {
        throw new Error('Function not implemented.');
      },
    };
    this.launchTarget = this.launchTargetService.toI18n(DefaultLaunchTarget);
  }

  ngOnInit(): void {
    this.localeService.getRecognitionLocale().subscribe((locale) => {
      this.currentLocale = locale;
      this.ref.detectChanges();
    });

    this.searchEngineService.getSearchEngine().subscribe((se) => {
      this.currentSearchEngine = se;
      this.ref.detectChanges();
    });

    this.inputDeviceService.getDefaultDevice().then(
      (d) => {
        this.inputDevices.push(d);
        this.currentInputDevice = d;
        this.ref.detectChanges();
      },
      (error) => {
        this.logger.error(error);
        if (!this.currentInputDevice) {
          this.currentInputDevice = this.NO_DEFAULT_INPUT_DEVICE;
        }
      }
    );

    this.launchTargetService.getLaunchTarget().subscribe((lt) => {
      this.launchTarget = this.launchTargetService.toI18n(lt);
      this.ref.detectChanges();
    });
  }

  setLocale(locale: LocaleProperties): void {
    this.localeService.setRecognitionLocale(locale);
  }
  setSearchEngine(se: SearchEngine): void {
    this.searchEngineService.setSearchEngine(se);
  }
  setLaunchTarget(lt: string): void {
    if (lt === 'Current Tab') {
      this.launchTargetService.setLaunchTarget(LaunchTarget.CURRENT_TAB);
    } else if (lt === 'New Tab') {
      this.launchTargetService.setLaunchTarget(LaunchTarget.NEW_TAB);
    }
  }
}
