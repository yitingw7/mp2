import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPokemon, getPokemonDetails, getPokemonTypes } from '../services/pokemonApi';
import { PokemonType } from '../types/pokemon';
import './GalleryView.css';

interface GalleryPokemon {
    id: number;
    name: string;
    image: string | null;
    types: string[];
}

const GalleryView: React.FC = () => {
    const [pokemonList, setPokemonList] = useState<GalleryPokemon[]>([]);
    const [filteredPokemon, setFilteredPokemon] = useState<GalleryPokemon[]>([]);
    const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

  const fetchPokemonData = async () => {
    try {
      setLoading(true);
      const response = await getAllPokemon(151, 0);
      
      const pokemonWithImages = await Promise.all(
        response.results.map(async (pokemon, index) => {
          try {
            const details = await getPokemonDetails(index + 1);
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.other?.['official-artwork']?.front_default || 
                     details.sprites.front_default,
              types: details.types.map(t => t.type.name)
            } as GalleryPokemon;
          } catch (error) {
            console.error(`Failed to fetch details for ${pokemon.name}:`, error);
            return {
              id: index + 1,
              name: pokemon.name,
              image: null,
              types: []
            } as GalleryPokemon;
          }
        })
      );
      
      setPokemonList(pokemonWithImages);
    } catch (error) {
      console.error('Failed to fetch Pokemon data:', error);
      setError('Failed to load Pokemon data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonTypes = async () => {
    try {
      const response = await getPokemonTypes();
      setPokemonTypes(response.results);
    } catch (error) {
      console.error('Failed to fetch Pokemon types:', error);
    }
  };

  const filterPokemonByType = useCallback(() => {
    if (selectedTypes.length === 0) {
      setFilteredPokemon(pokemonList);
    } else {
      const filtered = pokemonList.filter(pokemon =>
        selectedTypes.some(type => pokemon.types.includes(type))
      );
      setFilteredPokemon(filtered);
    }
  }, [pokemonList, selectedTypes]);

  useEffect(() => {
    fetchPokemonData();
    fetchPokemonTypes();
  }, []);

  useEffect(() => {
    filterPokemonByType();
  }, [filterPokemonByType]);

    const handleTypeToggle = (typeName: string) => {
        setSelectedTypes(prev =>
            prev.includes(typeName)
                ? prev.filter(type => type !== typeName)
                : [...prev, typeName]
        );
    };

    const handlePokemonClick = (pokemon: GalleryPokemon) => {
        navigate(`/pokemon/${pokemon.id}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading Pokemon gallery...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={fetchPokemonData} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="gallery-view">
            <div className="gallery-header">
                <h2>Pokemon Gallery</h2>
                <p>Click on any Pokemon to view details</p>
            </div>

            <div className="type-filters">
                <h3>Filter by Type</h3>
                <div className="type-buttons">
                    {pokemonTypes.map((type) => (
                        <button
                            key={type.name}
                            onClick={() => handleTypeToggle(type.name)}
                            className={`type-filter-btn ${selectedTypes.includes(type.name) ? 'active' : ''
                                }`}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
                {selectedTypes.length > 0 && (
                    <button
                        onClick={() => setSelectedTypes([])}
                        className="clear-filters-btn"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="pokemon-gallery">
                {filteredPokemon.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="gallery-card"
                        onClick={() => handlePokemonClick(pokemon)}
                    >
                        <div className="gallery-image">
                            {pokemon.image ? (
                                <img src={pokemon.image} alt={pokemon.name} />
                            ) : (
                                <div className="no-image">No Image</div>
                            )}
                        </div>
                        <div className="gallery-info">
                            <h4>{pokemon.name}</h4>
                            <div className="gallery-types">
                                {pokemon.types.map((type, index) => (
                                    <span key={index} className={`type-badge type-${type}`}>
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryView;