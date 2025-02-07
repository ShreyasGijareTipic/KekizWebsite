import React, { useEffect, useState } from 'react';
import { CBadge, CCol, CRow } from '@coreui/react';
import { MantineReactTable } from 'mantine-react-table';
import { getAPICall, putAPICall } from '../../../util/api';
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

  useEffect(() => {
    fetchOrders();
  }, [pagination.pageIndex, pagination.pageSize, route]);

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

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await put(`/api/order/${orderId}/deliver`);
      showToast('success', 'Order marked as delivered');
      fetchOrders();
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  const updateBalanceAmount = async (orderId, balance_amount) => {
    if (balance_amount === null || balance_amount === '') {
      showToast('danger', 'Balance amount is required');
      return;
    }

    try {
      const response = await putAPICall(`/api/order/${orderId}/balance`, { balance_amount });
      console.log(response);
      if (response?.message === 'Balance and Paid amount updated successfully') {
        showToast('success', 'Balance amount updated');
        
        // Refresh the page after updating the balance
        fetchOrders(); // Re-fetch the orders after balance update
        setUpdatedBalance(null); // Reset the updated balance input field
      }
    } catch (error) {
      showToast('danger', 'Error occurred: ' + (error.response?.data?.message || error.message));
    }
  };

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
            href={`sms:+91${cell.row.original.customer?.mobile}?body=Outstanding payment: Rs. ${cell.row.original.balance_amount}`}
          >
            <CIcon icon={cilChatBubble} />
          </a>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'Items',
      Cell: ({ cell }) => (
        cell.row.original.order_items.length > 0 ? (
          <table className="table table-sm">
            <tbody>
              {cell.row.original.order_items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.name}</td>
                  <td>{item.qty} X {item.price}₹</td>
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
      Cell: ({ cell }) => (
        <span>{cell.row.original.balance_amount} ₹</span>
      ),
    },
    { accessorKey: 'discount', header: 'Discount' },
    { accessorKey: 'invoiceDate', header: 'Invoice Date' },
    { accessorKey: 'delivery_date', header: 'Delivery Date' },
    {
      id: 'update_balance',
      header: 'Update Balance',
      Cell: ({ cell }) => (
        <div className="d-flex">
          {cell.row.original.balance_amount > 0 && cell.row.original.order_status !== 0 && (
            <div className="mt-2">
              <input 
                type="number" 
                value={updatedBalance !== null ? updatedBalance : cell.row.original.balance_amount} 
                onChange={(e) => setUpdatedBalance(e.target.value)} 
                className="form-control" 
                placeholder="Enter Balance Amount" 
              />
              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={() => updateBalanceAmount(cell.row.original.id, updatedBalance || cell.row.original.balance_amount)}
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
