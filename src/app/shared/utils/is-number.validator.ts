import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function IsNumberMatch(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const controlValue = +control.value;
        if (typeof(controlValue) !== 'number') {
            control.setErrors({ isNumberMatch: true });
        } else {
            control.setErrors(null);
        }
    };
}
