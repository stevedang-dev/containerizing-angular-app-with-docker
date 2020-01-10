import { Injectable } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormValidatorsService {

    constructor() { }

    triggerAllFields(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);

            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.triggerAllFields(control);
            }
        })
    }

    pizzaSizeValidator(): ValidatorFn {
        return (control: FormGroup): ValidationErrors | null => {
            const errors: ValidationErrors = {};
            // Check if the number of toppings exceed the limit allow for pizza size
            const currentPizzaSize = control.get('size').value;
            const selectedToppings = control.get('toppings').value.filter(topping => topping.selected);

            if (currentPizzaSize !== "LARGE" && selectedToppings.length > 4) {
                errors.toppingPizzaSize = {
                    message: 'To add more than 4 toppings please choose the large pizza.'
                };
            }

            return Object.keys(errors).length ? errors : null;
        };
    }
}
