import { createContext, useContext, useReducer, useState } from 'react';

const TarotContext = createContext();

const initialState = {
  spreads: [],
  selectedSpread: null,
  selectedDirection: null,
  cards: [],
  flippedCards: new Set(),
  interpretation: null,
  token: localStorage.getItem('tarot_token') || '',
};

function tarotReducer(state, action) {
  switch (action.type) {
    case 'SET_SPREADS':
      return { ...state, spreads: action.payload };
    case 'SET_SELECTED_SPREAD':
      return { ...state, selectedSpread: action.payload };
    case 'SET_SELECTED_DIRECTION':
      return { ...state, selectedDirection: action.payload };
    case 'SET_CARDS':
      return { ...state, cards: action.payload, flippedCards: new Set() };
    case 'FLIP_CARD':
      return {
        ...state,
        flippedCards: new Set([...state.flippedCards, action.payload]),
      };
    case 'SET_INTERPRETATION':
      return { ...state, interpretation: action.payload };
    case 'SET_TOKEN':
      localStorage.setItem('tarot_token', action.payload);
      return { ...state, token: action.payload };
    case 'RESET_DRAWING':
      return { ...state, cards: [], flippedCards: new Set(), interpretation: null };
    default:
      return state;
  }
}

export function TarotProvider({ children }) {
  const [state, dispatch] = useReducer(tarotReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    state,
    dispatch,
    loading,
    setLoading,
    error,
    setError,
  };

  return <TarotContext.Provider value={value}>{children}</TarotContext.Provider>;
}

export function useTarot() {
  const context = useContext(TarotContext);
  if (!context) {
    throw new Error('useTarot must be used within a TarotProvider');
  }
  return context;
}
