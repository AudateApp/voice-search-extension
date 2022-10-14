import { Injectable } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import { Mssg } from './i18n-mssg';
import { I18nService } from './i18n.service';
import { Logger } from './logging/logger';
import { LoggingService } from './logging/logging.service';
import { StorageService } from './storage/storage.service';

// How/where to open the URL
export enum LaunchTarget {
  CURRENT_TAB = "Current Tab",
  NEW_TAB = "New Tab",
}

// Open in "New Tab" by default, as it is non disruptive.
export const DefaultLaunchTarget = LaunchTarget.CURRENT_TAB;

/** Provide abstraction for target for opening URLs. */
@Injectable({
  providedIn: 'root',
})
export class LaunchTargetService {
  logger: Logger;
  currentLaunchTarget = DefaultLaunchTarget;
  currentLaunchTarget$: Subject<LaunchTarget> = new Subject();
  constructor(
    private storageService: StorageService,
    private i18n: I18nService,
    loggingService: LoggingService) {
    this.logger = loggingService.getLogger('LaunchTargetService');

    // Emit value from store as initial value.
    this.getSavedLaunchTarget().then(lt => this.currentLaunchTarget$.next(lt));
  }

  getLaunchTarget(): Observable<LaunchTarget> {
    return this.currentLaunchTarget$.asObservable().pipe(share());
  }

  toI18n(lt: LaunchTarget): string {
    switch (lt) {
      case LaunchTarget.CURRENT_TAB:
        return this.i18n.get(Mssg.QsLaunchCurrentTab);
      case LaunchTarget.NEW_TAB:
        return this.i18n.get(Mssg.QsLaunchNewTab);
    }
  }

  getSavedLaunchTarget(): Promise<LaunchTarget> {
    return this.storageService.get('launch_target').then(
      (lt: any) => {
        if (!lt) {
          return DefaultLaunchTarget;
        }
        return lt as LaunchTarget;
      },
      (errorReason) => {
        this.logger.error(
          'Failed to fetch launch target due to error: ',
          errorReason
        );
        this.logger.warn('Using default launch target instead');
        return DefaultLaunchTarget;
      }
    );
  }

  setLaunchTarget(lt: LaunchTarget) {
    this.storageService.put('launch_target', lt).then(
      () => {
        this.currentLaunchTarget$.next(lt);
      },
      (error) => {
        this.logger.error(error);
      }
    );
  }

}

