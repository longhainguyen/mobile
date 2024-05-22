import { CreateProfileDto } from '@cores/user/dto/create-profile.dto';
import { ProfileService } from '@cores/user/service/profile/profile.service';
import {
    Body,
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BirthDayProfilePipe } from '@pipes/birthday.pipe';

@Controller('profiles')
export class ProfileController {
    constructor(private ProfileService: ProfileService) {}
    @Post('create-profile/:id')
    createProfile(@Param('id', ParseIntPipe) id: number, @Body(BirthDayProfilePipe) profile: CreateProfileDto) {
        return this.ProfileService.createProfile(id, { ...profile });
    }

    @Patch('update-avatar/:id')
    @UseInterceptors(FileInterceptor('avatar'))
    updateAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile() avatar: Express.Multer.File) {
        return this.ProfileService.updateAvatar(id, avatar);
    }

    @Patch('update-background/:id')
    @UseInterceptors(FileInterceptor('background'))
    updateBackground(@Param('id', ParseIntPipe) id: number, @UploadedFile() background: Express.Multer.File) {
        return this.ProfileService.updateBackground(id, background);
    }

    @Delete('delete-avatar/:id')
    deleteAvatar(@Param('id', ParseIntPipe) id: number) {
        return this.ProfileService.deleteAvatar(id);
    }

    @Delete('delete-background/:id')
    deleteBackground(@Param('id', ParseIntPipe) id: number) {
        return this.ProfileService.deleteBackground(id);
    }
}
