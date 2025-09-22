import { Card, Input, Button, Title } from '@atoms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from '@molecules';

const AdminBookingsTab = ({ t, bookingColumns, bookingsWithActions, searchTerm, setSearchTerm, selectedItems, setSelectedItems }) => (
  <div className="admin__bookings">
    <div className="admin__section-header">
      <Title level={2}>{t('pages:admin.bookings.title')}</Title>
      <div className="admin__section-actions">
        <Input
          type="text"
          placeholder={t('pages:admin.bookings.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin__search-input"
          icon={faSearch}
        />
      </div>
    </div>
    <Card className="admin__table-card">
      <DataTable
        columns={bookingColumns}
        data={bookingsWithActions}
        searchTerm={searchTerm}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        className="admin__data-table"
      />
    </Card>
  </div>
);

export default AdminBookingsTab;
