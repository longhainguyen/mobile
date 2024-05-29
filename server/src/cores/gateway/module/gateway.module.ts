import { Module } from '@nestjs/common';
import { SocialGateway } from '../controller/gateway';
import { GatewayService } from '../service/gateway.service';

@Module({
    providers: [SocialGateway, GatewayService],
})
export class GatewayModule {}
