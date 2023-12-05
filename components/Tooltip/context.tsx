import React, {
  ReactNode, createContext, useContext, useReducer
} from 'react';
import type {
  TooltipState, TooltipDispatch, TooltipActions
} from 'types/Tooltip';

import { TooltipAction } from './actions';

const initialState: TooltipState = {
  content: undefined,
  position: { x: 0, y: 0 },
  mouse: { x: 0, y: 0 },
  error: undefined
};

const TooltipContext = createContext<TooltipState>(initialState);
const TooltipDispatchContext = createContext<React.Dispatch<TooltipDispatch>>(() => undefined);

function tooltipReducer(_state: TooltipState, action: TooltipActions) {
  switch (action.type) {
    case TooltipAction.HIDE: {
      return {
        content: {}
      };
    }

    case TooltipAction.UPDATE: {
      const { content, position } = action.payload;
      return {
        content: { Name: content?.Name, Description: content?.Description },
        position
      };
    }

    case TooltipAction.FAIL: {
      throw new Error(action.payload.error);
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function useTooltipState() {
  const context = useContext(TooltipContext);
  if (context === undefined) {
    throw new Error('useTooltipState must be used within a TooltipContextProvider');
  }
  return context;
}

export function useTooltipDispatch() {
  const context = useContext(TooltipDispatchContext);
  if (context === undefined) {
    throw new Error('useTooltipDispatch must be used within an TooltipContextProvider');
  }
  return context;
}

interface Props {
  children: ReactNode
}

export function TooltipContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(tooltipReducer as React.ReducerWithoutAction<TooltipState>, initialState);

  return (
    <TooltipContext.Provider value={state}>
      <TooltipDispatchContext.Provider value={dispatch}>
        {children}
      </TooltipDispatchContext.Provider>
    </TooltipContext.Provider>
  );
}

export default TooltipContextProvider;
