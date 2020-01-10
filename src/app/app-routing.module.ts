import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PizzaFormContainerComponent } from './containers/pizza-form-container/pizza-form-container.component';

const routes: Routes = [
    { path: '', component: PizzaFormContainerComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    static Components = [PizzaFormContainerComponent];
}
