import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { FormBuilderService } from './services/form-builder.service';
import { FormValidatorsService } from './services/form-validators.service';
import { FormEditorService } from './services/form-editor.service';

@Component({
    selector: 'app-pizza-form-container',
    templateUrl: './pizza-form-container.component.html',
    styleUrls: ['./pizza-form-container.component.scss'],
    providers: [FormBuilderService, FormValidatorsService, FormEditorService]
})
export class PizzaFormContainerComponent implements OnInit {
    @ViewChild('placeOrderButton', { static: true }) placeOrderButtonEl: ElementRef;
    get form(): FormGroup { return this.fbService.form; };
    get selectedPizza(): FormGroup { return this.fbService.selectedPizza; }
    get pizzas(): FormArray { return this.fbService.pizzas; }

    constructor(
        private fbService: FormBuilderService,
        private renderer: Renderer2
    ) { }

    ngOnInit() {

    }

    placeOrder(): void {
        if (!this.fbService.isValid) {
            this.setAttribute('');
            return;
        }
        console.log(this.form.value);
        this.setAttribute('modal');
        this.fbService.resetForm();
    }

    setAttribute(value: string): void {
        this.renderer.setAttribute(
            this.placeOrderButtonEl.nativeElement,
            'data-toggle',
            `${value}`
        );
    }

    reset(): void {
        this.fbService.resetForm();
    }

}
