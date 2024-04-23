import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import CloudinaryProvider from '@configs/cloudinary.config';

@Module({
    providers: [CloudinaryService, CloudinaryProvider],
    exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
