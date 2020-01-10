import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { FormBuilderService } from 'src/app/containers/pizza-form-container/services/form-builder.service';

@Component({
    selector: 'app-pizza-list',
    templateUrl: './pizza-list.component.html',
    styleUrls: ['./pizza-list.component.scss']
})
export class PizzaListComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() pizzas: FormArray;

    constructor(private fbService: FormBuilderService) { }

    ngOnInit() {

    }

    selectPizza(index: number): void {
        this.fbService.setSelectedPizza(index);
    }

    addPizza(): void {
        this.fbService.addPizza();
    }

    deletePizza(index: number): void {
        this.fbService.deletePizza(index);
    }

}
