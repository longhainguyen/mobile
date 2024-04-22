import { CreateProfileDto } from '@cores/user/dto/create-profile.dto';
import { ProfileService } from '@cores/user/service/profile/profile.service';
import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BirthDayProfilePipe } from '@pipes/birthday.pipe';

@Controller('profiles')
export class ProfileController {
    constructor(private ProfileService: ProfileService) {}
    @Post('create-profile/:id')
    createProfile(@Param('id', ParseIntPipe) id: number, @Body(BirthDayProfilePipe) profile: CreateProfileDto) {
        return this.ProfileService.createProfile(id, { ...profile });
    }
}
