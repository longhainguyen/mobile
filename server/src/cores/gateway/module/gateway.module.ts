import { Module } from '@nestjs/common';
import { SocialGateway } from '../controller/gateway.controller';
import { GatewayService } from '../service/gateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity, UserEntity } from '@entities/index';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, NotificationEntity])],
    providers: [SocialGateway, GatewayService],
})
export class GatewayModule {}
