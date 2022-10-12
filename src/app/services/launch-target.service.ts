import { Injectable } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import { Logger } from '../../shared/logging/logger';
import { LoggingService } from './logging/logging.service';
import { StorageService } from './storage/storage.service';

/** Provide abstraction for target for opening URLs. */
@Injectable({
  providedIn: 'root',
})
export class LaunchTargetService {
  logger: Logger;
  currentLaunchTarget = LaunchTarget.CURRENT_TAB;
  currentLaunchTarget$: Subject<LaunchTarget> = new Subject();
  constructor(
    private storageService: StorageService, loggingService: LoggingService) {
    this.logger = loggingService.getLogger('LaunchTargetService');
  }

  getLaunchTarget(): Observable<LaunchTarget> {
    return this.currentLaunchTarget$.asObservable().pipe(share());
  }

  getSavedLaunchTarget(): Promise<LaunchTarget> {
    return this.storageService.get('launch_target').then(
      (lt: any) => {
        return lt as LaunchTarget;
      },
      (errorReason) => {
        this.logger.error(
          'Failed to fetch launch target due to error: ',
          errorReason
        );
        this.logger.warn('Using default launch target instead');
        return LaunchTarget.CURRENT_TAB;
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

export enum LaunchTarget {
  CURRENT_TAB = "Current Tab",
  NEW_TAB = "New Tab",
}
