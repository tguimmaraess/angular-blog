import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { BarChartService } from './bar-chart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent = {} as ChartComponent;
  @Input() chartTitle: string = 'Bar Chart'; //Title of the chart
  @Input() seriesName: string = 'Data'; //Series name
  @Input() id: string = ''; //Id of the user that will be used to retrieve data

  private data: any = ''; //Data that will fill the chart
  public ok: boolean = false; //Data is ready
  public chartOptions: Partial<any> = {} as Partial<any>;
  private observable$: Subscription = {} as Subscription;

  constructor(private barChartService: BarChartService){ }

  ngOnInit(): void {
    //Gets bar chart data using user id
    this.getBarChartData(this.id);
  }

  //Gets bar chart data passing the user id
  getBarChartData(id: string) : void {
     this.observable$ = this.barChartService.getArticleVisitsPerMonth(id).subscribe((re: any) => {
      this.ok= true; //Defines ok as true. Means the information we need is here and we can display the chart
      this.data = re.result[0]; //Defines bar chart data with result from database

      //Bar chart options and data
      this.chartOptions = {
        series: [
          {
            name: this.seriesName,
            data: [
              this.data.januaryArticlesVisits[0].totalArticlesVisitsJanuary ,//All article visits in january
              this.data.februaryArticlesVisits[0].totalArticlesVisitsFebruary, //All article visits in February
              this.data.marchArticlesVisits[0].totalArticlesVisitsMarch, //All article visits in March
              this.data.aprilArticlesVisits[0].totalArticlesVisitsApril, //All article visits in April
              this.data.mayArticlesVisits[0].totalArticlesVisitsMay, //All article visits in May
              this.data.juneArticlesVisits[0].totalArticlesVisitsJune, //All article visits in June
              this.data.julyArticlesVisits[0].totalArticlesVisitsJuly, //All article visits in July
              this.data.augustArticlesVisits[0].totalArticlesVisitsAugust, //All article visits in August
              this.data.septemberArticlesVisits[0].totalArticlesVisitsSepptember, //All article visits in September
              this.data.octoberArticlesVisits[0].totalArticlesVisitsOctober, //All article visits in October
              this.data.novemberArticlesVisits[0].totalArticlesVisitsNovember, //All article visits in November
              this.data.decemberArticlesVisits[0].totalArticlesVisitsDecember, //All article visits in December
            ]
          }
        ],
        chart: {
          height: 350,
          width: '100%',
          type: 'bar'
        },
        title: {
          text: this.chartTitle
        },
        xaxis: {
          categories: ['Jan', 'Feb',  'Mar',  'Apr',  'May',  'Jun',  'Jul',  'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        responsive: [
          {
            breakpoint: 400,
            options: {
              plotOptions: {
                bar: {
                  horizontal: false
                }
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    });
  }

  ngOnDestroy(): void {
    this.observable$.unsubscribe();
  }

}
