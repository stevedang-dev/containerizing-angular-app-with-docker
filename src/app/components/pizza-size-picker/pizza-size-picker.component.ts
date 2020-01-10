import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { PizzaSize } from 'src/app/containers/pizza-form-container/models/pizza';

@Component({
    selector: 'app-pizza-size-picker',
    templateUrl: './pizza-size-picker.component.html',
    styleUrls: ['./pizza-size-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PizzaSizePickerComponent),
            multi: true
        }
    ]
})
export class PizzaSizePickerComponent implements ControlValueAccessor {
    selectedSize: string;
    pizzaSizes = [...Object.values(PizzaSize)];

    // Control Value Accessor:
    onChange = (value: string) => {};
    onTouched = () => {};

    // Allows Angular to update the value (selectedSize).
    writeValue(value: string) {
        this.selectedSize = value;
    }

    // Allows Angular to register a function to call when the input (selectedSize) changes.
    registerOnChange(fn) {
        this.onChange = fn;
    }

    // Allows Angular to register a function to call when the input has been touched.
    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    // Change size on touch/click from the view
    changeSize(size: string) {
        this.selectedSize = size;
        this.onChange(size);
    }
}
