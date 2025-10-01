import { ComponentFixture, TestBed } from "@angular/core/testing"
import { OneProportionComponent } from "./one-proportion.component"
import { TranslateModule } from "@ngx-translate/core"
import { FormsModule } from "@angular/forms"
import { NO_ERRORS_SCHEMA } from "@angular/core"

describe('OneProportionComponent', () => {
    let component: OneProportionComponent
    let fixture: ComponentFixture<OneProportionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OneProportionComponent],
            imports: [
                TranslateModule.forRoot(), 
                FormsModule,
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(OneProportionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()

        component.chart = {
            destroy: jest.fn(),
            data: { labels: [], datasets: [{ data: [] }] },
            update: jest.fn(),
        } as any
    })

    it('should create the component', () => {
        expect(component).toBeTruthy()
    })

    it('should initialize chart on AfterViewInit lifecycle hook', () => {
        const spyCreateChart = jest.spyOn(component, 'createChart')
        component.ngAfterViewInit()
        expect(spyCreateChart).toHaveBeenCalled()
    })

    it('should have default properties set correctly', () => {
        expect(component.noOfCoin).toBe(5)
        expect(component.probability).toBe(0.5)
        expect(component.labels).toEqual([])
        expect(component.binomialData).toEqual([])
        expect(component.samples).toEqual([])
        expect(component.selected).toEqual([])
        expect(component.mean).toBe(NaN)
        expect(component.std).toBe(NaN)
        expect(component.noOfSelected).toBe(0)
        expect(component.totalSamples).toBe(0)
        expect(component.lowerSelectedRange).toBe(0)
        expect(component.upperSelectedRange).toBe(0)
        expect(component.thisSampleSizes).toBe(1)
        expect(component.zoomIn).toBe(false)
        expect(component.interval).toBe(0)
        expect(component.proportion).toEqual('0/0 = NaN')
    })

    it('should reset properties to default when reset is called', () => {
        const spyCreateChart = jest.spyOn(component, 'createChart')
        component.ngAfterViewInit()

        component.noOfCoin = 10
        component.probability = 0.3

        component.reset()

        expect(spyCreateChart).toHaveBeenCalled()
        expect(component.noOfCoin).toBe(5)
        expect(component.probability).toBe(0.5)
    })

    afterEach(() => {
        fixture.destroy()
    })
})