import axios from 'axios';
import {
    PokemonListResponse,
    Pokemon,
    PokemonTypeResponse,
    PokemonSpecies
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const getAllPokemon = async (limit: number = 151, offset: number = 0): Promise<PokemonListResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch Pokemon list:', error);
        throw error;
    }
};

export const getPokemonDetails = async (id: number): Promise<Pokemon> => {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch Pokemon details:', error);
        throw error;
    }
};

export const getPokemonTypes = async (): Promise<PokemonTypeResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/type`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch Pokemon types:', error);
        throw error;
    }
};

export const getPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon-species/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch Pokemon species:', error);
        throw error;
    }
};