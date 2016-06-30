// action types
const PUSH = '@@redux-collections/PUSH';
const INSERT = '@@redux-collections/INSERT';
const UPDATE = '@@redux-collections/UPDATE';
const REMOVE = '@@redux-collections/REMOVE';
const POP = '@@redux-collections/POP';
const INIT = { type: '@@redux-collections/INIT' };

// higher order action creators
const createPushAction = key => () => {
  return { type: PUSH, key };
};

// this allows us to create a new state at the index in the list
const createInsertAction = key => index => {
  return { type: INSERT, key, index };
};

// this allows us to apply an action at a certain index in the list
const createUpdateAction = key => actionCreator => (index, ...args) => {
  return { type: UPDATE, key, index, action: actionCreator(...args) };
};

const createRemoveAction = key => index => {
  return { type: REMOVE, key, index };
};

const createPopAction = key => index => {
  return { type: POP, key };
};

// higher order reducer
function list(wrappedReducer) {

  // we need some way of identifying which reducer which action applies to
  // this is better for api than having to tell me the path of the reducer
  let key = Symbol('list-reducer');

  function reducer(state = [], action) {

    if(action.key !== key) {
      return state;
    }

    switch(action.type) {

      // push an element to the end of the state
      case PUSH:
        return [
          ...state,
          wrappedReducer(undefined, INIT)
        ];

      // insert an element at the specified index
      case INSERT:
        return [
          ...state.slice(0,action.index),
          wrappedReducer(undefined, INIT),
          ...state.slice(action.index)
        ];

      // update allows us to create an action and apply it to the item at that index
      case UPDATE:
        return [
          ...state.slice(0,action.index),
          wrappedReducer(state[action.index], action.action),
          ...state.slice(action.index + 1)
        ];

      // remove an element from the specified index
      case REMOVE:
        return [
          ...state.slice(0,action.index),
          ...state.slice(action.index + 1)
        ];

      // remove an element from the end of the list
      case POP:
        return [
          ...state.slice(0,state.length - 1)
        ];
    }

    return state;
  }

  // finally, return the action creators and the reducer
  return {
    reducer,
    push: createPushAction(key),
    insert: createInsertAction(key),
    update: createUpdateAction(key),
    remove: createRemoveAction(key),
    pop: createPopAction(key)
  };
}

export { list };
