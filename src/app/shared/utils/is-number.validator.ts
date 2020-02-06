import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function IsNumberMatch(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const controlValue = +control.value;
        // if (control.errors) {
        //     // return if another validator has already found an error on the matchingControl
        //     return;
        // }
        if (typeof(controlValue) !== 'number') {
            control.setErrors({ isNumberMatch: true });
        } else {
            control.setErrors(null);
        }
        // const matchingControl = formGroup.controls[matchingControlName];

        // if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        //     // return if another validator has already found an error on the matchingControl
        //     return;
        // }

        // // set error on matchingControl if validation fails
        // if (control.value !== matchingControl.value) {
        //     matchingControl.setErrors({ mustMatch: true });
        // } else {
        //     matchingControl.setErrors(null);
        // }
    };
}