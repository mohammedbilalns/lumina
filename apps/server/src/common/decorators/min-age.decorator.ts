import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'minAge', async: false })
export class MinAgeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    if (!value) return false;
    const minAge = args.constraints[0] as number;
    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      !(value instanceof Date)
    ) {
      return false;
    }

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= minAge;
  }

  defaultMessage(args: ValidationArguments) {
    return `User must be at least ${args.constraints[0]} years old`;
  }
}

export function MinAge(age: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const target = (
      object as {
        constructor: new (...args: never[]) => object;
      }
    ).constructor;

    registerDecorator({
      target,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [age],
      validator: MinAgeConstraint,
    });
  };
}
