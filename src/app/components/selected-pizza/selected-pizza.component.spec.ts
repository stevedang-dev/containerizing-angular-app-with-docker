import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPizzaComponent } from './selected-pizza.component';

describe('SelectedPizzaComponent', () => {
    let component: SelectedPizzaComponent;
    let fixture: ComponentFixture<SelectedPizzaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectedPizzaComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectedPizzaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
