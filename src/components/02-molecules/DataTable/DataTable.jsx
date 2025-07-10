import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSort, 
  faSortUp, 
  faSortDown, 
  faCheck 
} from '@fortawesome/free-solid-svg-icons';
import './DataTable.scss';

/**
 * DataTable component - Table de données avec tri, recherche et sélection
 * @param {Object} props - Component props
 * @param {Array} props.columns - Configuration des colonnes
 * @param {Array} props.data - Données à afficher
 * @param {string} props.searchTerm - Terme de recherche
 * @param {Array} props.selectedItems - Éléments sélectionnés
 * @param {Function} props.onSelectionChange - Callback de changement de sélection
 * @param {string} props.className - Classes CSS additionnelles
 */
const DataTable = ({ 
  columns,
  data,
  searchTerm = '',
  selectedItems = [],
  onSelectionChange,
  className = '',
  ...props
}) => {
  const { t } = useTranslation('common');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrage des données selon le terme de recherche
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Tri des données
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Gestion du tri
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Gestion de la sélection
  const handleItemSelection = (item) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    let newSelection;

    if (isSelected) {
      newSelection = selectedItems.filter(selected => selected.id !== item.id);
    } else {
      newSelection = [...selectedItems, item];
    }

    onSelectionChange && onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === sortedData.length) {
      onSelectionChange && onSelectionChange([]);
    } else {
      onSelectionChange && onSelectionChange(sortedData);
    }
  };

  const isAllSelected = selectedItems.length === sortedData.length && sortedData.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < sortedData.length;

  const tableClasses = [
    'data-table',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={tableClasses} {...props}>
      <div className="data-table__wrapper">
        <table className="data-table__table">
          <thead className="data-table__head">
            <tr className="data-table__row data-table__row--header">
              <th className="data-table__cell data-table__cell--checkbox">
                <label className="data-table__checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={handleSelectAll}
                    className="data-table__checkbox"
                  />
                  <span className="data-table__checkmark">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </label>
              </th>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`data-table__cell data-table__cell--header ${
                    column.sortable ? 'data-table__cell--sortable' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="data-table__header-content">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="data-table__sort-icon">
                        <FontAwesomeIcon 
                          icon={
                            sortConfig.key === column.key
                              ? sortConfig.direction === 'asc'
                                ? faSortUp
                                : faSortDown
                              : faSort
                          }
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="data-table__body">
            {sortedData.map((item) => {
              const isSelected = selectedItems.some(selected => selected.id === item.id);
              
              return (
                <tr 
                  key={item.id}
                  className={`data-table__row ${
                    isSelected ? 'data-table__row--selected' : ''
                  }`}
                >
                  <td className="data-table__cell data-table__cell--checkbox">
                    <label className="data-table__checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleItemSelection(item)}
                        className="data-table__checkbox"
                      />
                      <span className="data-table__checkmark">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    </label>
                  </td>
                  {columns.map((column) => (
                    <td 
                      key={column.key}
                      className="data-table__cell"
                    >
                      {column.key === 'status' ? (
                        <span className={`data-table__status data-table__status--${item[column.key].toLowerCase()}`}>
                          {item[column.key]}
                        </span>
                      ) : (
                        item[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="data-table__empty">
          <p>{t('noDataFound')}</p>
        </div>
      )}

      <div className="data-table__footer">
        <span className="data-table__info">
          {selectedItems.length > 0 && (
            <span className="data-table__selection-info">
              {t('itemsSelected', { count: selectedItems.length })} • 
            </span>
          )}
          {t('resultsCount', { current: sortedData.length, total: data.length })}
        </span>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool
  })).isRequired,
  data: PropTypes.array.isRequired,
  searchTerm: PropTypes.string,
  selectedItems: PropTypes.array,
  onSelectionChange: PropTypes.func,
  className: PropTypes.string
};

export default DataTable;
