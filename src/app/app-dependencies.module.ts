import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
} from '@angular/material';

import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { SelectedPizzaComponent } from './components/selected-pizza/selected-pizza.component';
import { PizzaSizePickerComponent } from './components/pizza-size-picker/pizza-size-picker.component';
import { PizzaListComponent } from './components/pizza-list/pizza-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';

export const APP_MODULE_DECLARATIONS = [
    NavbarComponent,
    SelectedPizzaComponent,
    PizzaListComponent,
    CustomerDetailsComponent,
    PizzaSizePickerComponent
];

export const APP_MODULE_IMPORTS = [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
];
