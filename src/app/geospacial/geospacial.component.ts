import {
  Component,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { mapStyles } from './map-styles';
import { ApiService } from '../shared/api/api.service';

@Component({
  selector: 'app-geospacial',
  templateUrl: 'geospacial.component.html',
  styleUrls: ['geospacial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeospacialComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') map;
  @ViewChildren('branches') branches;
  public isCollapsed: boolean = true;
  public subscription;
  public mapMeta = {
    lat: 41.4090,
    lng: -75.6624,
    zoom: 6,
    height: undefined,
    styles: mapStyles,
    loaded: false
  };
  public isOpen = false;

  constructor(public apiService: ApiService) { }

  public ngOnInit(): void {
    this.mapMeta.height = (window.innerHeight - this.map.nativeElement.offsetTop) + 'px';
  }

  ngAfterViewInit(): void {
    this.subscription = this.branches.changes.subscribe(children => {
      this.updateLabels();
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public updateLabels(): void {
    setTimeout( () => this.addClassToLabels(), 0);
  }

  public scheduleUpdate(): void {
    setTimeout( () => {
      this.addClassToLabels();
    }, 500);
  }

  private addClassToLabels(): void {
    let scheduleUpdate = false;
    this.isOpen = true;
    this.branches.forEach(branch => {
      if (branch.content === null || branch.content.parentElement === null) {
        return;
      }
      let el = branch.content.parentElement.parentElement.previousSibling;
      if (el !== undefined && el.classList !== undefined) {
        el.classList.add('map-label');
      }
      if (el === undefined || el.classList === undefined || !el.classList.contains('map-label')) {
        scheduleUpdate = true;
      }
    });
   if (scheduleUpdate) {
     this.scheduleUpdate();
   }
  }

}
