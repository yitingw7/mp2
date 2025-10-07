import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPokemon, getPokemonDetails } from '../services/pokemonApi';
import './ListView.css';

interface PokemonListItem {
    id: number;
    name: string;
    image: string | null;
    types: string[];
    height: number;
    weight: number;
    base_experience: number;
}

const ListView: React.FC = () => {
    const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
    const [filteredPokemon, setFilteredPokemon] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

  const fetchPokemonData = async () => {
    try {
      setLoading(true);
      const response = await getAllPokemon(151, 0);
      
      const pokemonWithDetails = await Promise.all(
        response.results.map(async (pokemon, index) => {
          try {
            const details = await getPokemonDetails(index + 1);
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.front_default,
              types: details.types.map(t => t.type.name),
              height: details.height,
              weight: details.weight,
              base_experience: details.base_experience
            } as PokemonListItem;
          } catch (error) {
            console.error(`Failed to fetch details for ${pokemon.name}:`, error);
            return {
              id: index + 1,
              name: pokemon.name,
              image: null,
              types: [],
              height: 0,
              weight: 0,
              base_experience: 0
            } as PokemonListItem;
          }
        })
      );
      
      setPokemonList(pokemonWithDetails);
    } catch (error) {
      console.error('Failed to fetch Pokemon data:', error);
      setError('Failed to load Pokemon data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPokemon = useCallback(() => {
    let filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'height':
          aValue = a.height;
          bValue = b.height;
          break;
        case 'weight':
          aValue = a.weight;
          bValue = b.weight;
          break;
        case 'base_experience':
          aValue = a.base_experience;
          bValue = b.base_experience;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPokemon(filtered);
  }, [pokemonList, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchPokemonData();
  }, []);

  useEffect(() => {
    filterAndSortPokemon();
  }, [filterAndSortPokemon]);

    const handlePokemonClick = (pokemon: PokemonListItem) => {
        navigate(`/pokemon/${pokemon.id}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading Pokemon data...</p>
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
        <div className="list-view">
            <div className="search-and-sort">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search Pokemon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="sort-container">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="id">Sort by ID</option>
                        <option value="height">Sort by Height</option>
                        <option value="weight">Sort by Weight</option>
                        <option value="base_experience">Sort by Base Experience</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        className="sort-select"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            <div className="pokemon-grid">
                {filteredPokemon.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="pokemon-card"
                        onClick={() => handlePokemonClick(pokemon)}
                    >
                        <div className="pokemon-image">
                            {pokemon.image ? (
                                <img src={pokemon.image} alt={pokemon.name} />
                            ) : (
                                <div className="no-image">No Image</div>
                            )}
                        </div>
                        <div className="pokemon-info">
                            <h3>{pokemon.name}</h3>
                            <p>ID: {pokemon.id}</p>
                            <div className="pokemon-types">
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

export default ListView;
