import { AbstractControl, ValidatorFn } from '@angular/forms';

export function deadlineValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentTime = new Date();
    const deadline = new Date(control.value);

    if (deadline.getTime() <= currentTime.getTime() + 5 * 60 * 1000) {
      return { 'invalidDeadline':  { message: 'Deadline must be at least 5 minutes in the future.' } };
    }
    return null;
  };
}