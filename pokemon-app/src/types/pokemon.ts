export interface PokemonBasicInfo {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonBasicInfo[];
}

export interface PokemonType {
    name: string;
    url: string;
}

export interface PokemonAbility {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface PokemonSprites {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
    other?: {
        'official-artwork'?: {
            front_default: string | null;
            front_shiny: string | null;
        };
    };
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    types: Array<{
        slot: number;
        type: PokemonType;
    }>;
    abilities: PokemonAbility[];
    stats: PokemonStat[];
    sprites: PokemonSprites;
}

export interface PokemonSpecies {
    id: number;
    name: string;
    flavor_text_entries: Array<{
        flavor_text: string;
        language: {
            name: string;
            url: string;
        };
        version: {
            name: string;
            url: string;
        };
    }>;
}

export interface PokemonTypeResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonType[];
}