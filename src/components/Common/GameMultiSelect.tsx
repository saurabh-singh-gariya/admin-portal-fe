import { useState, useEffect, useRef } from 'react';
import { X, Search, Check } from 'lucide-react';

interface Game {
  gameCode: string;
  gameName: string;
  isActive: boolean;
}

interface GameMultiSelectProps {
  selectedGames: string[];
  onChange: (gameCodes: string[]) => void;
  availableGames: Game[];
  isLoading?: boolean;
}

export default function GameMultiSelect({
  selectedGames,
  onChange,
  availableGames,
  isLoading = false,
}: GameMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter games based on search query
  const filteredGames = availableGames.filter((game) =>
    game.gameCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.gameName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleGame = (gameCode: string) => {
    if (selectedGames.includes(gameCode)) {
      onChange(selectedGames.filter((code) => code !== gameCode));
    } else {
      onChange([...selectedGames, gameCode]);
    }
  };

  const removeGame = (gameCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedGames.filter((code) => code !== gameCode));
  };

  const getGameName = (gameCode: string) => {
    const game = availableGames.find((g) => g.gameCode === gameCode);
    return game ? game.gameName : gameCode;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Games Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent flex items-center flex-wrap gap-2"
      >
        {selectedGames.length === 0 ? (
          <span className="text-gray-500 text-sm">Select games...</span>
        ) : (
          selectedGames.map((gameCode) => (
            <span
              key={gameCode}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md"
            >
              {getGameName(gameCode)}
              <button
                type="button"
                onClick={(e) => removeGame(gameCode, e)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
        <div className="ml-auto flex items-center gap-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary-500"></div>
          )}
          <Search size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Search Input */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Games List */}
          <div className="py-1">
            {filteredGames.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {searchQuery ? 'No games found' : 'No games available'}
              </div>
            ) : (
              filteredGames.map((game) => {
                const isSelected = selectedGames.includes(game.gameCode);
                return (
                  <div
                    key={game.gameCode}
                    onClick={() => toggleGame(game.gameCode)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{game.gameName}</div>
                      <div className="text-xs text-gray-500">{game.gameCode}</div>
                    </div>
                    {isSelected && (
                      <Check size={16} className="text-blue-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

