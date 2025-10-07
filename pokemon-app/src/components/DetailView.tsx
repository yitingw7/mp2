import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonDetails, getPokemonSpecies } from '../services/pokemonApi';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import './DetailView.css';

const DetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [species, setSpecies] = useState<PokemonSpecies | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    useEffect(() => {
        if (id) {
            fetchPokemonData(parseInt(id));
        }
    }, [id]);

    const fetchPokemonData = async (pokemonId: number) => {
        try {
            setLoading(true);
            const [pokemonData, speciesData] = await Promise.all([
                getPokemonDetails(pokemonId),
                getPokemonSpecies(pokemonId)
            ]);

            setPokemon(pokemonData);
            setSpecies(speciesData);
        } catch (error) {
            console.error('Failed to fetch Pokemon data:', error);
            setError('Failed to load Pokemon details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const navigateToPokemon = (direction: 'prev' | 'next') => {
        if (!pokemon) return;

        const newId = direction === 'prev' ? pokemon.id - 1 : pokemon.id + 1;
        if (newId >= 1 && newId <= 151) {
            navigate(`/pokemon/${newId}`);
        }
    };

    const getStatName = (statName: string): string => {
        const statNames: { [key: string]: string } = {
            'hp': 'HP',
            'attack': 'Attack',
            'defense': 'Defense',
            'special-attack': 'Sp. Attack',
            'special-defense': 'Sp. Defense',
            'speed': 'Speed'
        };
        return statNames[statName] || statName;
    };

    const getTypeColor = (type: string): string => {
        const colors: { [key: string]: string } = {
            'normal': '#A8A878',
            'fire': '#F08030',
            'water': '#6890F0',
            'electric': '#F8D030',
            'grass': '#78C850',
            'ice': '#98D8D8',
            'fighting': '#C03028',
            'poison': '#A040A0',
            'ground': '#E0C068',
            'flying': '#A890F0',
            'psychic': '#F85888',
            'bug': '#A8B820',
            'rock': '#B8A038',
            'ghost': '#705898',
            'dragon': '#7038F8',
            'dark': '#705848',
            'steel': '#B8B8D0',
            'fairy': '#EE99AC'
        };
        return colors[type] || '#68A090';
    };

    const getAvailableImages = () => {
        if (!pokemon) return [];

        const images = [];
        if (pokemon.sprites.front_default) images.push(pokemon.sprites.front_default);
        if (pokemon.sprites.back_default) images.push(pokemon.sprites.back_default);
        if (pokemon.sprites.front_shiny) images.push(pokemon.sprites.front_shiny);
        if (pokemon.sprites.back_shiny) images.push(pokemon.sprites.back_shiny);
        if (pokemon.sprites.other?.['official-artwork']?.front_default) {
            images.push(pokemon.sprites.other['official-artwork'].front_default);
        }
        if (pokemon.sprites.other?.['official-artwork']?.front_shiny) {
            images.push(pokemon.sprites.other['official-artwork'].front_shiny);
        }

        return images;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading Pokemon details...</p>
            </div>
        );
    }

    if (error || !pokemon) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error || 'Pokemon not found'}</p>
                <button onClick={() => navigate('/')} className="retry-button">
                    Back to List
                </button>
            </div>
        );
    }

    const availableImages = getAvailableImages();
    const englishFlavorText = species?.flavor_text_entries.find(
        entry => entry.language.name === 'en'
    )?.flavor_text;

    return (
        <div className="detail-view">
            <div className="detail-header">
                <button onClick={() => navigate('/')} className="back-button">
                    ← Back to List
                </button>

                <div className="navigation-buttons">
                    <button
                        onClick={() => navigateToPokemon('prev')}
                        disabled={pokemon.id <= 1}
                        className="nav-button prev-button"
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={() => navigateToPokemon('next')}
                        disabled={pokemon.id >= 151}
                        className="nav-button next-button"
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div className="pokemon-detail">
                <div className="pokemon-images">
                    <div className="main-image">
                        {availableImages.length > 0 ? (
                            <img
                                src={availableImages[currentImageIndex]}
                                alt={pokemon.name}
                            />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                    </div>

                    {availableImages.length > 1 && (
                        <div className="image-thumbnails">
                            {availableImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${pokemon.name} ${index + 1}`}
                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="pokemon-info">
                    <h1 className="pokemon-name">{pokemon.name}</h1>
                    <p className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</p>

                    <div className="pokemon-types">
                        {pokemon.types.map((type, index) => (
                            <span
                                key={index}
                                className="type-badge"
                                style={{ backgroundColor: getTypeColor(type.type.name) }}
                            >
                                {type.type.name}
                            </span>
                        ))}
                    </div>

                    {englishFlavorText && (
                        <div className="pokemon-description">
                            <h3>Description</h3>
                            <p>{englishFlavorText}</p>
                        </div>
                    )}

                    <div className="pokemon-stats">
                        <h3>Base Stats</h3>
                        <div className="stats-grid">
                            {pokemon.stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <span className="stat-name">{getStatName(stat.stat.name)}</span>
                                    <div className="stat-bar">
                                        <div
                                            className="stat-fill"
                                            style={{
                                                width: `${(stat.base_stat / 255) * 100}%`,
                                                backgroundColor: getTypeColor(pokemon.types[0]?.type.name || 'normal')
                                            }}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{stat.base_stat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pokemon-details">
                        <div className="detail-item">
                            <span className="detail-label">Height:</span>
                            <span className="detail-value">{(pokemon.height / 10).toFixed(1)} m</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Weight:</span>
                            <span className="detail-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Base Experience:</span>
                            <span className="detail-value">{pokemon.base_experience}</span>
                        </div>
                    </div>

                    <div className="pokemon-abilities">
                        <h3>Abilities</h3>
                        <div className="abilities-list">
                            {pokemon.abilities.map((ability, index) => (
                                <span
                                    key={index}
                                    className={`ability-badge ${ability.is_hidden ? 'hidden' : ''}`}
                                >
                                    {ability.ability.name}
                                    {ability.is_hidden && ' (Hidden)'}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailView;