import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChartComponent, ApexNonAxisChartSeries,  ApexResponsive, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { PieChartService } from './pie-chart.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent = {} as ChartComponent;
  @Input() chartTitle: string = 'Bar Chart'; //Title of the chart
  @Input() labels: Array<string> = [] as Array<string>; //Chart labels
  @Input() data: Array<number> = [] as Array<number>; //Pie Chart data
  @Input() id: string = ''; //Id of the user that will be used to retrieve data

  public chartOptions: Partial<any> = {} as Partial<any>;

  constructor(private pieChartService: PieChartService){ }

  ngOnInit(): void {
    //Pie chart label, data and options
    this.chartOptions = {
     series: this.data,
     chart: {
       width: 380,
       type: "pie"
     },    
     labels: this.labels,
     responsive: [
       {
         breakpoint: 480,
         options: {
           chart: {
             width: 200
           },
           legend: {
             position: "bottom"
           }
         }
       }
     ]
    };
  }

}
