import { useReducer } from 'react';
import './App.css';
import { EpicCherryContext } from './utils';
import { OperationsSection, Result, VariablesList } from './components';
import { UseSelectorCallback } from './types';
import { initialState, reducer } from './reducers/app';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  const getValue = <R extends unknown>(callback: UseSelectorCallback): R => {
    return callback(state) as R;
  };

  return (
    <EpicCherryContext.Provider value={{ getValue, dispatch }}>
      <div className="App">
        <section className="App-header">
          <div className="App-variables">
            <VariablesList />
          </div>
          <div className="App-operations">
            <OperationsSection />
          </div>
          <div className="App-result">
            <Result />
          </div>
        </section>
      </div>
    </EpicCherryContext.Provider>
  );
}

export default App;
