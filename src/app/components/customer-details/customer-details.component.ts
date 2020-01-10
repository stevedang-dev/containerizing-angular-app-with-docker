import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-customer-details',
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
    @Input() group: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.prepForm();
    }

    prepForm(): void {
        if (!this.group) {
            this.group = this.fb.group({
                firstName: [null, Validators.required],
                lastName: [null, Validators.required],
                phoneNumber: [null, Validators.required],
                address: this.fb.group({
                    street: [null, Validators.required],
                    apt: [null],
                    city: [null, Validators.required],
                    zipcode: [null, Validators.required]
                })
            });
        }
    }
}
