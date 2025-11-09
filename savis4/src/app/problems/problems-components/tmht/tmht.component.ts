import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartDataSets, ChartType, Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { max, standardDeviation } from 'simple-statistics';

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
      enQuestion: "A coffee shop claims that their coffee is served at an average temperature of <b>175°F</b>. A health inspector suspects it’s lower. She samples <b>n = 25 cups</b> and finds: <br><br> <b>Sample mean = </b>172°F<br><b>Sample standard deviation = </b>6°F <br><br>At the <b>0.05 significance level</b>, test whether the coffee is served cooler than claimed.",
      esQuestion:"Una cafetería afirma que su café se sirve a una temperatura promedio de <b>175°F</b>. Una inspectora sanitaria sospecha que es más baja. Toma una muestra de <b>n = 25 tazas</b> y encuentra: <br><br> <b>Media muestral =</b> 172 °F <br><b> Desviación estándar muestral =</b> 6 °F <br><br> Con un <b>nivel de significancia de 0.05</b>, realice una prueba para determinar si el café se sirve a una temperatura menor a la declarada.",
      nullHyp: '175',
      testType: 't-test',
      pval:'0.0098',
      answer:'Reject null hypothsis',
      sampleMean:172,
      alpha:0.05
    },
    {
      enQuestion:"A company advertises that their phone’s battery lasts an average of <b>10 hours</b> on a full charge. A consumer agency tests <b>40 phones</b> and finds: <br><br><b>Sample mean =</b> 9.6 hours<br><b>Population standard deviation = </b>1.2 hours<br><br>At <b>α = 0.01,</b> is there evidence that the mean battery life is less than advertised?",
      esQuestion:"Una empresa anuncia que la batería de su teléfono dura un promedio de <b>10 horas</b> con una carga completa. Una agencia de consumidores prueba <b>40 teléfonos</b> y encuentra: <br><br><b>Media muestral =</b> 9.6 horas<br><b>Desviación estándar poblacional =</b> 1.2 horas<br><br>Con un nivel de significancia de <b>α = 0.01</b>, ¿existe evidencia de que la duración promedio de la batería sea menor a la anunciada?",
      nullHyp:'10',
      testType:'z-test',
      pval:'0.0175',
      answer:"Fail to reject null hypothesis",
      sampleMean:9.6,
      alpha:0.01
    },
    {
      enQuestion:"A city planner believes that the average commute time for residents is <b>more than 30 minutes</b>. A random sample of <b>36 residents</b> has:<br><br><b>Sample mean =</b> 32 minutes<br><b>Sample standard deviation =</b> 5 minutes <br><br>Test the claim at the <b>0.05 significance level</b>.",
      esQuestion:"Un planificador urbano cree que el tiempo promedio de viaje al trabajo de los residentes es <b>más de 30 minutos</b>. Una muestra aleatoria de <b>36 residentes</b> tiene:<br><br><b>Media muestral =</b> 32 minutos<br><b>Desviación estándar muestral =</b> 5 minutos <br><br>Pruebe la afirmación con un nivel de significancia de <b>0.05</b>.",
      nullHyp:'30',
      testType:'t-test',
      pval:'0.0109',
      answer:"Reject null hypothesis",
      sampleMean:32,
      alpha:0.05
    },
    {
      enQuestion:"A university claims its students have an <b>average GPA of 3.2</b>. A sample of <b>16 students</b> shows a <b>mean GPA of 3.05</b> with a <b>sample standard deviation of 0.4</b>. At <b>α = 0.10</b>, test whether the average GPA is different from the university’s claim.",
      esQuestion:"Una universidad afirma que sus estudiantes tienen un <b>promedio de calificaciones (GPA) de 3.2</b>. Una muestra de <b>16 estudiantes</b> muestra un <b>GPA promedio de 3.05</b> con una <b>desviación estándar muestral de 0.4.</b> Con un <b>nivel de significancia de α = 0.10</b>, determine si el GPA promedio difiere del que afirma la universidad.",
      nullHyp:'3.2',
      testType:'t-test',
      pval:'0.1544',
      answer:"Fail to reject null hypothesis",
      sampleMean:3.05,
      alpha:0.10
    },
    {
      enQuestion:"A delivery company states that their small boxes weigh on average <b>2.5 lbs</b>. A customer suspects the boxes are lighter than advertised. They weigh <b>50 boxes</b> and find: <br><br><b>Mean weight =</b> 2.45 lbs<br><b>Population standard deviation =</b> 0.2 lbs<br><br>At the <b>0.05 significance level</b>, test if the boxes are lighter than claimed.",
      esQuestion:"Una empresa de reparto afirma que sus cajas pequeñas pesan en promedio <b>2.5 libras</b>. Un cliente sospecha que las cajas son más ligeras de lo anunciado. Pesa <b>50 cajas</b> y encuentra: <br><br><b>Peso medio =</b> 2.45 libras<br><b>Desviación estándar de la población =</b> 0.2 libras<br><br> Con un <b>nivel de significancia de 0.05</b>, realice una prueba para determinar si las cajas son más ligeras de lo que se afirma.",
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
    this.correctAnswer=this.problems[this.currProblemIndex].nullHyp;
    this.correctAnswer2=this.problems[this.currProblemIndex].pval
    this.correctAnswer3=this.problems[this.currProblemIndex].testType;
    this.correctAnswer4=this.problems[this.currProblemIndex].answer;

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
      const{nullHyp,sampleMean,alpha,answer}=problem;

      const h0=parseFloat(nullHyp);
      const sampMean=parseFloat(String(sampleMean));
      const failToReject=answer.toLowerCase().includes("fail")

      const minX=Math.min(h0,sampMean)-Math.abs(h0-sampMean)*2;
      const maxX=Math.max(h0,sampMean)+Math.abs(h0-sampMean)*2;

      const se=Math.abs((maxX-minX)/10);
      const xVals:number[]=[];
      const yVals:number[]=[];
      for(let x=minX;x<=maxX;x+=(maxX-minX)/50){
        const pdf=Math.exp(-0.5*((x-h0)/se)**2);
        xVals.push(x);
        yVals.push(pdf);
      }

      const tail=sampMean < h0 ? 'left' : 'right';
      const critBound=tail ==='left' ? h0-1.645*se : h0+1.645*se;

      const rejectRegion=xVals.map((x,i)=>{
        if(tail==='left' && x<=critBound){return{x,y:yVals[i]};}
        if(tail==='right' && x>=critBound){return{x,y:yVals[i]};}
        return null;
      }).filter(Boolean);

      this.chart5.data.datasets=[
        {
          label:"Null Distribution",
          data:xVals.map((x,i)=>({x,y:yVals[i]})),
          borderColor:'orange',
          fill:false,
          showLine:true,
          pointRadius:0,
        },
        {
          label:"Rejection Region",
          data:rejectRegion,
          borderColor:'rgba(255, 0, 0, 0.3)',
          backgroundColor:'rgba(255, 0, 0, 0.3)',
          fill:true,
          showLine:true,
          pointRadius:0,
        },
        {
          label:"Null Mean",
          data:[{x:h0,y:Math.exp(-0.5*((h0-h0)/se)**2)}],
          backgroundColor:'blue',
          pointRadius:6,
        },
        {
          label:'Sample Mean',
          data:[{x:sampMean,y:Math.exp(-0.5*((sampMean-h0)/se)**2)}],
          backgroundColor: failToReject ? 'green' : 'red',
          pointRadius:8,
        },
      ];

      this.chart5.options.scales.xAxes[0].ticks.min=minX;
      this.chart5.options.scales.xAxes[0].ticks.max=maxX;
      this.chart5.update();
    }
  }

  createChart5() {
    const ctx = this.chart5Ref.nativeElement.getContext('2d')
    if (ctx) {
      this.chart5 = new Chart(ctx, {
        type:'scatter',
        data:{datasets:[]},
        options:{
          responsive:true,
          maintainAspectRatio:false,
          scales:{
            xAxes:[{
              ticks:{
                fontColor:'black',
                fontSize:14,
                padding:5,
                min:0,
                max:10,
              },
              scaleLabel:{
                display:true,
                labelString:'Mean Value',
                fontSize:16,
              },
            }],
            yAxes:[{
              ticks:{display:false, min:0},
              scaleLabel:{display:false},
            }],
          },
          legend:{labels:{fontSize:12}},
          tooltips:{enabled:false},
          animation:{duration:500},
        },
      });
    }
  }
}