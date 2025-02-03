import React, { useEffect, useState } from 'react';
import { CBadge, CCol, CRow } from '@coreui/react';
import { MantineReactTable } from 'mantine-react-table';
import { getAPICall, put } from '../../../util/api';
import ConfirmationModal from '../../common/ConfirmationModal';
import { useToast } from '../../common/toast/ToastContext';
import { CIcon } from '@coreui/icons-react';
import { cilPhone, cilChatBubble } from '@coreui/icons';
import { useTranslation } from 'react-i18next';

const Orders = () => {
  const { showToast } = useToast();
  const { t } = useTranslation('global');
  const [orders, setOrders] = useState([]);
  const [deleteOrder, setDeleteOrder] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [updatedBalance, setUpdatedBalance] = useState(null); // Track updated balance amount
  const route = window.location.href.split('/').pop();

  // Fetch orders based on pagination and route
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      if (!orders.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const type = route === 'bookings' ? 2 : -1; // Ensure only order_type=2 for bookings
      const response = await getAPICall(
        `/api/order?orderType=${type}&page=${pagination.pageIndex + 1}&perPage=${pagination.pageSize}`
      );

      // Filter data directly in the frontend if required, but ideally handle it in the backend API
      if (route === 'bookings') {
        setOrders(response.data.filter(order => order.order_status === 2)); // Only show bookings (order_type=2)
      } else {
        setOrders(response.data);
      }

      setRowCount(response.total); // Set the total count for pagination
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  // Fetch data whenever pagination or route changes
  useEffect(() => {
    fetchOrders();
  }, [pagination.pageIndex, pagination.pageSize, route]);

  // Handle deleting an order
  const handleDelete = async () => {
    try {
      await put(`/api/order/${deleteOrder.id}/cancel`);
      setDeleteModalVisible(false);
      showToast('success', 'Order is canceled');
      fetchOrders();
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  // Handle marking an order as delivered
  const handleMarkAsDelivered = async (orderId) => {
    try {
      await put(`/api/order/${orderId}/deliver`);
      showToast('success', 'Order marked as delivered');
      fetchOrders();
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  // Update balance amount for the order
  const updateBalanceAmount = async (orderId, amount) => {
    try {
      const response = await put(`/api/order/${orderId}/balance`, { balance_amount: amount });
      if (response.data?.message === 'Balance updated successfully') {
        showToast('success', 'Balance amount updated');
        fetchOrders(); // Refetch to show updated data
      }
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  // Columns for the MantineReactTable
  const columns = [
    { accessorKey: 'customer.name', header: 'Name' },
    {
      accessorKey: 'customer.mobile',
      header: 'Call',
      Cell: ({ cell }) => (
        <div>
          <a className="btn btn-outline-info btn-sm" href={`tel:+91${cell.row.original.customer?.mobile}`}>
            <CIcon icon={cilPhone} />
          </a>
          &nbsp;&nbsp;
          <a
            className="btn btn-outline-success btn-sm"
            href={`sms:+91${cell.row.original.customer?.mobile}?body=Outstanding payment: Rs. ${cell.row.original.balance}`}
          >
            <CIcon icon={cilChatBubble} />
          </a>
        </div>
      ),
    },
    {
      accessorKey: 'items',
      header: 'Items',
      Cell: ({ cell }) => (
        cell.row.original.order_items.length > 0 ? (
          <table className="table table-sm">
            <tbody>
              {cell.row.original.order_items.map((i) => (
                <tr key={i.id}>
                  <td>{i.product.name}</td>
                  <td>{i.qty} X {i.price}₹</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : ('Only cash collected')
      ),
    },
    { accessorKey: 'paid_amount', header: 'Paid' },
    { accessorKey: 'total_amount', header: 'Total' },
    { 
      accessorKey: 'balance_amount', 
      header: 'Balance Amount',
      Cell: ({ cell }) => {
        // `balance_amount` already exists in the table
        return (
          <span>{cell.row.original.balance_amount} ₹</span>
        );
      }
    },
    { accessorKey: 'discount', header: 'Discount' },
    {
      accessorKey: 'order_status',
      header: 'Status',
      Cell: ({ cell }) => (
        <CBadge color={cell.row.original.order_status === 0 ? 'danger' : cell.row.original.order_status === 1 ? 'success' : 'warning'}>
          {cell.row.original.order_status === 0 ? 'Canceled' : cell.row.original.order_status === 1 ? 'Delivered' : 'Pending'}
        </CBadge>
      ),
    },
    {
      id: 'update_balance',
      header: 'Update Balance',
      Cell: ({ cell }) => (
        <div className="d-flex">
          {cell.row.original.order_status !== 0 && (
            <div className="mt-2">
              <input 
                type="number" 
                value={updatedBalance || cell.row.original.balance_amount} 
                onChange={(e) => setUpdatedBalance(e.target.value)} 
                className="form-control" 
                placeholder="Enter Balance Amount" 
              />
              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={() => updateBalanceAmount(cell.row.original.id, updatedBalance)}
              >
                Update Balance
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      Cell: ({ cell }) => (
        <div>
          {cell.row.original.order_status === 0 ? (
            <CBadge color="danger">Canceled</CBadge>
          ) : route === 'bookings' && cell.row.original.order_status === 2 ? (
            <CBadge color="success" onClick={() => handleMarkAsDelivered(cell.row.original.id)}>Mark as Delivered</CBadge>
          ) : (
            <CBadge color="info" onClick={() => window.location.href = `/#/invoice-details/${cell.row.original.id}`}>View</CBadge>
          )}
        </div>
      ),
    },
  ];

  return (
    <CRow>
      <ConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onYes={handleDelete}
        resource={`${t('LABELS.cancel_order')} -` + deleteOrder?.id}
      />
      <CCol xs={12}>
        <h2 className="text-center">{route === 'bookings' ? t('LABELS.advance_booking') : t('LABELS.all_orders')}</h2>
        <MantineReactTable
          columns={columns}
          data={orders}
          state={{ isLoading, pagination, showProgressBars: isRefetching }}
          manualPagination
          onPaginationChange={setPagination}
          rowCount={rowCount}
          paginationDisplayMode={'pages'}
          enableFullScreenToggle={false}
        />
      </CCol>
    </CRow>
  );
};

export default Orders;
