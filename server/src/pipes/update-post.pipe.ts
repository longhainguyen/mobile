import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PostParseJsonPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(value);
        if (metadata.type === 'body' && metadata.data === 'deleted') {
            value = JSON.parse(value);
        }
        return value;
    }
}
