# redux-list
Some higher order actions that help with list state management.

## list higher order reducer

### Example usage
```js
// todoListReducer.js
import { list } from 'redux-list';

// actions for a todo
function createEditAction(text) {
  return { type: 'EDIT', text };
}

function createCompleteAction() {
  return { type: 'COMPLETE' };
}

// the todo reducer for each element in the collection
const initialState = { text: '', completed: false };
function todo(state = initialState, action) {
  switch(action.type) {
    case 'EDIT':
      return {
        ...state,
        text: action.text
      };

    case 'COMPLETE':
      return {
        ...state,
        complete: true
      };
  }

  return state;
}

// the exports are based on redux modules
// https://github.com/erikras/ducks-modular-redux
const { reducer, actions: { push, insert, update, remove, pop } } = list(todo);

export default reducer;
export { push, insert, remove, pop, edit: update(createEditAction), complete: update(createCompleteAction) };
```

```js
// store.js
import { createStore } from 'redux';
import reducer, { push, edit, complete, insert, remove, pop } from './todoListReducer';
let store = createStore(reducer);

// Some example usage here

store.dispatch(push());
// nextState: [{ text: '', completed: false }]

store.dispatch(push());
// nextState: [{ text: '', completed: false }, { text: '', completed: false }]

store.dispatch(edit(0, 'first'));
// nextState: [{ text: 'first', completed: false }, { text: '', completed: false }]

store.dispatch(edit(1, 'second'));
// nextState: [{ text: 'first', completed: false }, { text: 'second', completed: false }]

store.dispatch(complete(1));
// nextState: [{ text: 'first', completed: false }, { text: 'second', completed: true }]

store.dispatch(insert(1));
// nextState: [{ text: 'first', completed: false }, { text: '', completed: false }, { text: 'second', completed: true }]

store.dispatch(remove(1));
// nextState: [{ text: 'first', completed: false }, { text: 'second', completed: true }]

store.dispatch(pop());
// nextState: [{ text: 'first', completed: false }]
```
