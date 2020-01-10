import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-selected-pizza',
    templateUrl: './selected-pizza.component.html',
    styleUrls: ['./selected-pizza.component.scss']
})
export class SelectedPizzaComponent implements OnInit {
    @Input() selectedPizza: FormGroup;

    get toppings(): FormArray {
        if (!this.selectedPizza || !this.selectedPizza) {
            return;
        }
        return this.selectedPizza.get('toppings') as FormArray;
    }

    constructor() { }

    ngOnInit() {

    }
}
