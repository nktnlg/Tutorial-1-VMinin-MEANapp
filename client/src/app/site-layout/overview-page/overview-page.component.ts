import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StatsService} from "../../shared/services/stats.service";
import {Observable} from "rxjs";
import {OverviewPage} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef: ElementRef
  tapTarget: MaterialInstance
  yesterday: Date = new Date()
  data$: Observable<OverviewPage>
  constructor(private service: StatsService) { }

  ngOnInit(): void {
    this.data$ = this.service.getOverview()
    this.yesterday.setDate(this.yesterday.getDate() -1 )
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy()
  }

  openInfo() {
    this.tapTarget.open()
  }
}
