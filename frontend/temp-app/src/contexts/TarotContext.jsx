import React, { createContext, useContext, useReducer } from 'react';

const TarotContext = createContext();

const initialState = {
  selectedSpread: null,
  selectedTopic: null,
  deck: [],
  drawnCards: [],
  interpretations: {},
  history: [],
  isLoading: false,
  error: null
};

const tarotReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_SPREAD':
      return {
        ...state,
        selectedSpread: action.payload,
        selectedTopic: null,
        deck: [],
        drawnCards: []
      };
    
    case 'SELECT_TOPIC':
      return {
        ...state,
        selectedTopic: action.payload
      };
    
    case 'SET_DECK':
      return {
        ...state,
        deck: action.payload
      };
    
    case 'DRAW_CARD':
      return {
        ...state,
        deck: state.deck.map(card => 
          card.id === action.payload.id 
            ? { ...card, isDrawn: true }
            : card
        ),
        drawnCards: [...state.drawnCards, action.payload]
      };
    
    case 'FLIP_CARD':
      return {
        ...state,
        deck: state.deck.map(card => 
          card.id === action.payload.id 
            ? { ...card, isFlipped: true }
            : card
        )
      };
    
    case 'ADD_INTERPRETATION':
      return {
        ...state,
        interpretations: {
          ...state.interpretations,
          [action.payload.cardId]: action.payload.interpretation
        }
      };
    
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [...state.history, action.payload]
      };
    
    case 'CLEAR_READING':
      return {
        ...state,
        selectedSpread: null,
        selectedTopic: null,
        deck: [],
        drawnCards: [],
        interpretations: {}
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const TarotProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tarotReducer, initialState);

  const value = {
    state,
    dispatch
  };

  return (
    <TarotContext.Provider value={value}>
      {children}
    </TarotContext.Provider>
  );
};

export const useTarot = () => {
  const context = useContext(TarotContext);
  if (!context) {
    throw new Error('useTarot must be used within a TarotProvider');
  }
  return context;
};