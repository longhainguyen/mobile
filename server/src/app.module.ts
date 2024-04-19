import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, PostEntity, ProfileEntity } from '@entities/index';
import { AuthModule } from '@cores/auth/module/auth.module';
import { UserModule } from '@cores/user/module/user.module';
import { PostModule } from '@cores/post/module/post.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'manhburn453',
            database: 'social_media',
            entities: [UserEntity, ProfileEntity, PostEntity],
            synchronize: true,
        }),
        AuthModule,
        UserModule,
        PostModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
