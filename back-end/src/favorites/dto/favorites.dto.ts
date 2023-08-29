export class FavoritesResponseDTO {
    name: string;
    price: number;
    photo: string;

    constructor(partial: Partial<FavoritesResponseDTO>) {
        Object.assign(this, partial)
    }
}
