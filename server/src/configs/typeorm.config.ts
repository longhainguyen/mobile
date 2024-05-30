import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
    CommentEntity,
    ImageEntity,
    LikeEntity,
    NotificationEntity,
    PostEntity,
    ProfileEntity,
    UserEntity,
    VideoEntity,
} from '@entities/index';

export default class TypeOrmConfig {
    static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [
                UserEntity,
                ProfileEntity,
                PostEntity,
                ImageEntity,
                VideoEntity,
                LikeEntity,
                CommentEntity,
                NotificationEntity,
            ],
            synchronize: true,
        };
    }
}

export const typeormConfig: TypeOrmModuleAsyncOptions = {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return TypeOrmConfig.getOrmConfig(configService);
    },
};
