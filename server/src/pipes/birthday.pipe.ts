import { HttpException, HttpStatus, Inject, Injectable, PipeTransform } from '@nestjs/common';
@Injectable()
export class BirthDayProfilePipe implements PipeTransform {
    transform(value: any) {
        console.log(value);
        if (value?.birthday) {
            const date = new Date(value.birthday);
            return { ...value, birthday: date };
        }
        throw new HttpException('Birthday is required', HttpStatus.BAD_REQUEST);
    }
}
