import { SavedRitualsService } from './saved-rituals.service';
import { ToggleSavedRitualDto } from './dto/toggle-saved-ritual.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class SavedRitualsController {
    private readonly savedRitualsService;
    constructor(savedRitualsService: SavedRitualsService);
    toggle(dto: ToggleSavedRitualDto, req: {
        user: JwtUser;
    }): unknown;
    findAll(req: {
        user: JwtUser;
    }): unknown;
}
export {};
