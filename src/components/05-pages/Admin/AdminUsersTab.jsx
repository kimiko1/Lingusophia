import { Card, Input, Button } from '@atoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from '@molecules';

const AdminUsersTab = ({ t, userColumns, usersWithActions, searchTerm, setSearchTerm, selectedItems, setSelectedItems, isLoading, handleAddNew }) => (
  <div className="admin__users">
    <div className="admin__section-header">
      <div className="admin__search-filter">
        <Input
          type="text"
          placeholder={t('pages:admin.users.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin__search-input"
          icon={faSearch}
        />
        <Button variant="outline" className="admin__filter-btn">
          <FontAwesomeIcon icon={faFilter} />
          {t('pages:admin.actions.filter')}
        </Button>
      </div>
      <Button 
        variant="primary"
        onClick={() => handleAddNew('user')}
        className="admin__add-btn"
      >
        <FontAwesomeIcon icon={faPlus} />
        {t('pages:admin.users.addUser')}
      </Button>
    </div>
    <Card className="admin__table-card">
      {usersWithActions.length === 0 ? (
        <div className="admin__empty-message">
          {isLoading
            ? t('pages:admin.users.loading', 'Chargement des utilisateurs...')
            : t('pages:admin.users.empty', 'Aucun utilisateur à afficher.')}
        </div>
      ) : (
        <DataTable
          columns={userColumns}
          data={usersWithActions}
          searchTerm={searchTerm}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          className="admin__data-table"
        />
      )}
    </Card>
  </div>
);

export default AdminUsersTab;
