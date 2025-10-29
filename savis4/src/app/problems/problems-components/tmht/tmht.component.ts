//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartDataSets, ChartType, Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { standardDeviation } from 'simple-statistics';


@Component({
  selector: 'app-user-manual',
  templateUrl: './tmht.component.html',
  styleUrls: ['./tmht.component.scss']
})
export class TMHTProblemsComponent implements AfterViewInit {

  @ViewChild('diffChart') chart5Ref: ElementRef<HTMLCanvasElement>

  chart5: Chart;

  nullHypResp: string = '';
  pValResp: string='';
  testTypeResp:string='';
  conclResp:string='';
  answer1IsCorrect: boolean = false;
  answer2IsCorrect: boolean = false;
  answer3IsCorrect: boolean = false;
  answer4IsCorrect: boolean = false;
  problemCorrect:boolean=false;
  showAnswer: boolean = false;
  correctAnswer: string = '';
  correctAnswer2:string='';
  correctAnswer3:string='';
  correctAnswer4:string='';
  currProblemIndex: number=0;

  problems=[
    {
      question: "A coffee shop claims that their coffee is served at an average temperature of <b>175°F</b>. A health inspector suspects it’s lower. She samples <b>n = 25 cups</b> and finds: <br><br> <b>Sample mean = </b>172°F<br><b>Sample standard deviation = </b>6°F <br><br>At the <b>0.05 significance level</b>, test whether the coffee is served cooler than claimed.",
      nullHyp: '175',
      testType: 't-test',
      pval:'0.0098',
      answer:'Reject null hypothsis',
      sampleMean:172,
      alpha:0.05
    },
    {
      question:"A company advertises that their phone’s battery lasts an average of <b>10 hours</b> on a full charge. A consumer agency tests <b>40 phones</b> and finds: <br><br><b>Sample mean =</b> 9.6 hours<br><b>Population standard deviation = </b>1.2 hours<br><br>At <b>α = 0.01,</b> is there evidence that the mean battery life is less than advertised?",
      nullHyp:'10',
      testType:'z-test',
      pval:'0.0175',
      answer:"Fail to reject null hypothesis",
      sampleMean:9.6,
      alpha:0.01
    },
    {
      question:"A city planner believes that the average commute time for residents is <b>more than 30 minutes</b>. A random sample of <b>36 residents</b> has:<br><br><b>Sample mean =</b> 32 minutes<br><b>Sample standard deviation =</b> 5 minutes <br><br>Test the claim at the <b>0.05 significance level</b>.",
      nullHyp:'30',
      testType:'t-test',
      pval:'0.0109',
      answer:"Reject null hypothesis",
      sampleMean:32,
      alpha:0.05
    },
    {
      question:"A university claims its students have an <b>average GPA of 3.2</b>. A sample of <b>16 students</b> shows a <b>mean GPA of 3.05</b> with a <b>sample standard deviation of 0.4</b>. At <b>α = 0.10</b>, test whether the average GPA is different from the university’s claim.",
      nullHyp:'3.2',
      testType:'t-test',
      pval:'0.1544',
      answer:"Fail to reject null hypothesis",
      sampleMean:3.05,
      alpha:0.10
    },
    {
      question:"A delivery company states that their small boxes weigh on average <b>2.5 lbs</b>. A customer suspects the boxes are lighter than advertised. They weigh <b>50 boxes</b> and find: <br><br><b>Mean weight =</b> 2.45 lbs<br><b>Population standard deviation =</b> 0.2 lbs<br><br>At the <b>0.05 significance level</b>, test if the boxes are lighter than claimed.",
      nullHyp:'2.5',
      testType:'z-test',
      pval:'0.0386',
      answer:"Reject null hypothesis",
      sampleMean:2.45,
      alpha:0.05
    }
  ]

  constructor(
    private translate: TranslateService,
  ) {
      //select rand problem
      this.currProblemIndex=Math.floor(Math.random()*this.problems.length);
      this.correctAnswer=this.problems[this.currProblemIndex].nullHyp;
      this.correctAnswer2=this.problems[this.currProblemIndex].pval
      this.correctAnswer3=this.problems[this.currProblemIndex].testType;
      this.correctAnswer4=this.problems[this.currProblemIndex].answer;
    }

  submitAnswer(){
    this.answer1IsCorrect = this.nullHypResp.trim()===this.correctAnswer;
    this.answer2IsCorrect=this.pValResp.trim()===this.correctAnswer2;
    this.answer3IsCorrect=this.testTypeResp.trim()===this.correctAnswer3;
    this.answer4IsCorrect=this.conclResp.trim()===this.correctAnswer4;
    this.showAnswer = true;
    if(this.answer1IsCorrect && this.answer2IsCorrect && this.answer3IsCorrect && this.answer4IsCorrect ){
      this.problemCorrect=true;
      this.updateChartWithData();
    }else{
      this.problemCorrect=false;
      this.updateChartWithData();
    }
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  nextQuestion(){
    this.nullHypResp='';
    this.pValResp='';
    this.testTypeResp='';
    this.conclResp='';
    this.answer1IsCorrect=false;
    this.answer2IsCorrect=false;
    this.answer3IsCorrect=false;
    this.answer4IsCorrect=false;
    this.problemCorrect=false;
    this.showAnswer=false;

    this.currProblemIndex=(this.currProblemIndex+1)%this.problems.length;
    this.correctAnswer=this.problems[this.currProblemIndex].answer;

    //Reset chart
    if(this.chart5){
      this.createChart5();
    }
  }

  ngAfterViewInit() {
    this.createChart5()
  }

  updateChartWithData():void{
    if(this.chart5){
      const problem=this.problems[this.currProblemIndex];
      const{nullHyp,testType,pval,answer,sampleMean,alpha}=problem;

      const h0=parseFloat(nullHyp);
      const sampMean=parseFloat(String(sampleMean));
      const pValue=parseFloat(pval);

      //clear prev data
      this.chart5.data.datasets.forEach(dataset=>(dataset.data=[]));

      const correctCol=this.problemCorrect ? 'green':'red';
      const rejectCol=pValue<alpha ? 'red' : 'green';
      const regionLabel=pValue<alpha ? 'Reject Null Hypothsis' : 'Fail to Reject Null Hypothsis';

      this.chart5.data.datasets[0].data.push(h0,0);
      this.chart5.data.datasets[1].data.push(sampMean,0);

      this.chart5.data.datasets[2]={
        label:regionLabel,
        backgroundColor:rejectCol,
        showLine:false,
        pointRadius:0,
        data:Array.from({length:100},(__dirname,i)=>({
          x:h0+(pValue<alpha ? i-10:1-50),
          y:Math.random()*0.05-0.025,
        }))
      };
      this.chart5.data.datasets[0].backgroundColor='blue';
      this.chart5.data.datasets[1].backgroundColor=correctCol;
      this.chart5.update();
    }
  }

  createChart5() {
    const ctx = this.chart5Ref.nativeElement.getContext('2d')
    if (ctx) {
      this.chart5 = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Null Mean',
              backgroundColor: 'blue',
              pointRadius:8,
              data: []
            },
            {
              label: `Sample Mean`,
              backgroundColor: 'green',
              pointRadius:8,
              data: []
            },
            {
              label: `Decision Region`,
              backgroundColor: 'black',
              pointRadius:8,
              data: []
            },
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: -5.4,
                  max: 75,
                  stepSize: 10,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('tm_diff_mean'),
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 1,
                  max: 7,
                  //stepSize: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('tm_freq'),
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          },
          animation: {
            duration: 0,
          }
        }
      })
    }
  }

}