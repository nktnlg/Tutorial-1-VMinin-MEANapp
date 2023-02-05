import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {StatsService} from "../../shared/services/stats.service";
import {AnalyticsPage} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale} from "chart.js"

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('income') incomeRef: ElementRef
  @ViewChild('orders') ordersRef: ElementRef

  aSub: Subscription
  average: number
  pending = true

  constructor(private service: StatsService) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)
  }

  ngAfterViewInit(): void {
    const incomeConfig: any = {
      label: 'Income',
      color: 'rgb(255, 99, 132)'
    }

    const ordersConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data:AnalyticsPage) => {
      this.average = data.average

      incomeConfig.labels = data.chart.map(item => item.label)
      incomeConfig.data = data.chart.map(item => item.income)

      ordersConfig.labels = data.chart.map(item => item.label)
      ordersConfig.data = data.chart.map(item => item.orders)
      console.log(ordersConfig.labels)
      console.log(ordersConfig.orders)


      const incomeCtx = this.incomeRef.nativeElement.getContext('2d')
      incomeCtx.canvas.height = '300px'

      const ordersCtx = this.ordersRef.nativeElement.getContext('2d')
      ordersCtx.canvas.height = '300px'


      new Chart(incomeCtx, createChartConfig(incomeConfig) as ChartConfiguration)
      new Chart(ordersCtx, createChartConfig(ordersConfig) as ChartConfiguration)

      this.pending = false
    })
  }
  ngOnDestroy(): void {
    if(this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
