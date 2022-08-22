import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getContent } from 'lib/api';

const TooltipContext = createContext();
const TooltipDispatchContext = createContext();

function tooltipReducer(state, payload) {
  switch (payload.type) {
    case 'hide': {
      return {
        content: {},
        position: { left: 0, top: 0 }
      };
    }
    case 'updatePosition': {
      return {
        ...state,
        position: payload.mouse
      };
    }
    case 'startUpdate': {
      return {
        content: {},
        position: { left: 0, top: 0 }
      };
    }
    case 'finishUpdate': {
      const { content, position } = payload;
      return {
        content: { Name: content.Name, Description: content.Description },
        position
      };
    }
    case 'updateFailed': {
      throw new Error(payload.error);
    }
    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
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

export async function updateTooltip(dispatch, data) {
  const {
    action, position, staticContent, remote
  } = data;
  dispatch({ type: 'startUpdate', data });

  if (!remote) {
    dispatch({
      type: 'finishUpdate',
      content: action,
      position
    });
  } else if (staticContent) {
    if (staticContent !== false) {
      dispatch({
        type: 'finishUpdate',
        content: { Name: staticContent },
        position
      });
    }
  } else {
    try {
      const content = await getContent(action.UrlType, action.ID);

      if (content.Description) {
        dispatch({ type: 'finishUpdate', content, position });
      } else {
        dispatch({ type: 'finishUpdate', content: action, position });
      }
    } catch (error) {
      dispatch({ type: 'updateFailed', error });
    }
  }
}

export function TooltipContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    tooltipReducer,
    { content: {}, position: { left: 0, top: 0 } }
  );

  return (
    <TooltipContext.Provider value={state}>
      <TooltipDispatchContext.Provider value={dispatch}>
        {children}
      </TooltipDispatchContext.Provider>
    </TooltipContext.Provider>
  );
}

TooltipContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()
  ]).isRequired
};

export default TooltipContextProvider;
