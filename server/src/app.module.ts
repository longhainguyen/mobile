import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, PostEntity, ProfileEntity, VideoEntity, ImageEntity } from '@entities/index';
import { AuthModule } from '@cores/auth/module/auth.module';
import { UserModule } from '@cores/user/module/user.module';
import { PostModule } from '@cores/post/module/post.module';
import { typeormConfig } from '@configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync(typeormConfig),
        AuthModule,
        UserModule,
        PostModule,
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
