import { Injectable } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormArray,
    FormControl
} from '@angular/forms';

import { PizzaToppingsEnum, PizzaSize } from '../models/pizza';
import { FormValidatorsService } from './form-validators.service';

@Injectable({
    providedIn: 'root'
})
export class FormBuilderService {
    form: FormGroup;
    availableToppings = [...Object.values(PizzaToppingsEnum)];

    get pizzas(): FormArray {
        return this.form.get('pizzas') as FormArray;
    }

    get selectedPizzaIndex(): FormControl {
        return this.form.get('selectedPizzaIndex') as FormControl;
    }

    get selectedPizza(): FormGroup {
        if (!this.pizzas || !this.selectedPizzaIndex) {
            return;
        }
        return this.pizzas.get(`${this.selectedPizzaIndex.value}`) as FormGroup;
    }

    get isValid(): boolean {
        if (!this.form.valid) {
            this.formValidatorsService.triggerAllFields(this.form);
            return false;
        }

        return true;
    }

    constructor(
        private fb: FormBuilder,
        private formValidatorsService: FormValidatorsService
    ) {
        this.createForm();
        // Default 1 pizza, or get out.
        this.addPizza();
    }

    createForm(): void {
        this.form = this.fb.group({
            selectedPizzaIndex: null,
            pizzas: this.fb.array([]),
            customerDetails: this.fb.group({
                firstName: [null, Validators.required],
                lastName: [null, Validators.required],
                phoneNumber: [null, Validators.required],
                address: this.fb.group({
                    street: [null, Validators.required],
                    apt: [null],
                    city: [null, Validators.required],
                    zipcode: [null, Validators.required]
                })
            })
        });
    }

    addPizza(size = PizzaSize.MEDIUM): void {
        this.pizzas.push(
            this.fb.group({
                size: [size],
                toppings: this.mapToppingsToCheckboxArrayGroup(
                    this.availableToppings
                )
            }, {
                validators: this.formValidatorsService.pizzaSizeValidator()
            })
        );
        this.setSelectedPizza(this.pizzas.length - 1);
        this.form.markAsDirty();
    }

    deletePizza(index: number): void {
        if (this.pizzas.length === 1) {
            return;
        }
        this.pizzas.removeAt(index);
        this.setSelectedPizza(this.pizzas.length - 1);
        this.form.markAsDirty();
    }

    setSelectedPizza(index: number): void {
        this.form.get('selectedPizzaIndex').setValue(index);
    }

    resetForm(): void {
        while (this.pizzas.length > 0) {
            this.pizzas.removeAt(0);
        }
        this.form.reset();
        // Add back the default pizza
        if (this.pizzas.length === 0) {
            this.addPizza();
        }
    }

    private mapToppingsToCheckboxArrayGroup(data: string[]): FormArray {
        return this.fb.array(
            data.map((item) => {
                // create a formgroup with controls name and selected.
                return this.fb.group({
                    name: item as string,
                    selected: false
                });
            })
        );
    }
}
