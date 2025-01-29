// #region imports
import React from 'react';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { useCallback} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
// #endregion

export const App: React.FC = () => {
  // #region useStates
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDisplayedDropdown, setIsDisplayedDropdown] = useState(false);

  // const [savedQuery, setSavedQuery] = useState('');
  // #endregion

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(((event.target.value)));
    applyQuery(event.target.value);

    peopleFromServer.map((person) => {
      if (query.toLowerCase() === person.name.toLowerCase()) {
        setSelectedPerson(person);
      }
    });
  }, [query])

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);

    setIsDisplayedDropdown(false);
  };

  
  const filteredPeople = peopleFromServer.filter((person) => {
    return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
  });

  const isEmptyPeopleList = filteredPeople.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson && selectedPerson.name.toLowerCase() === query.toLowerCase() ? (
            `${selectedPerson.name} ${selectedPerson.born} - ${selectedPerson.died}`)
            : (
              'Select a person'
            )
          }
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => {
                if (!isEmptyPeopleList) {
                  setIsDisplayedDropdown(true)
                }
              }}
            />
          </div>
          
          {isDisplayedDropdown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map((person) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                  >
                    <p
                      className="has-text-link"
                      onClick={() => handleSelectPerson(person)}
                    >{person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
          style={{ display: filteredPeople.length ? 'none' : 'block' }}
        >
          <p className="has-text-danger">
            No matching suggestions
          </p>
        </div>
      </main>
    </div>
  );
};


