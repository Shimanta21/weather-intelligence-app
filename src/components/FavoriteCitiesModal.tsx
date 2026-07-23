import React from 'react';
import { GeocodingLocation } from '../types';
import { Bookmark, MapPin, Trash2, X, ChevronRight } from 'lucide-react';

interface FavoriteCitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: GeocodingLocation[];
  onSelectCity: (location: GeocodingLocation) => void;
  onRemoveFavorite: (id: number) => void;
  onClearAll: () => void;
}

export const FavoriteCitiesModal: React.FC<FavoriteCitiesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 rounded-3xl max-w-md w-full shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] text-zinc-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100 font-display">Saved Cities</h3>
              <p className="text-xs text-zinc-400">{favorites.length} bookmarked locations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-favorites-modal-btn"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List */}
        <div className="p-5 overflow-y-auto divide-y divide-zinc-800/60 flex-1 space-y-2">
          {favorites.length > 0 ? (
            favorites.map((city) => (
              <div
                key={city.id}
                className="pt-2 first:pt-0 flex items-center justify-between group p-3 rounded-2xl hover:bg-zinc-800/60 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-zinc-950 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-100 text-sm group-hover:text-sky-400">
                      {city.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    title="View Weather"
                    className="p-2 text-zinc-400 hover:text-sky-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(city.id)}
                    title="Remove Bookmark"
                    className="p-2 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-zinc-500 space-y-3">
              <Bookmark className="w-10 h-10 mx-auto text-zinc-600" />
              <p className="text-sm font-medium text-zinc-300">No saved cities yet.</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Click the bookmark star icon on any city forecast card to quickly save it here!
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {favorites.length > 0 && (
          <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 font-bold hover:underline cursor-pointer"
            >
              Clear All Bookmarks
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-sky-500 text-zinc-950 text-xs font-bold rounded-xl hover:bg-sky-400 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
