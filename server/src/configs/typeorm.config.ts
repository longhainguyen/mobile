import { ImageEntity } from '@entities/image.entity';
import { PostEntity } from '@entities/post.entity';
import { ProfileEntity } from '@entities/profile.entity';
import { UserEntity } from '@entities/user.entity';
import { VideoEntity } from '@entities/video.entity';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export default class TypeOrmConfig {
    static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [UserEntity, ProfileEntity, PostEntity, ImageEntity, VideoEntity],
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
