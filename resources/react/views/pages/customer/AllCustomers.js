import React, { useEffect, useState } from 'react';
import { CBadge, CRow } from '@coreui/react';
import { MantineReactTable } from 'mantine-react-table';
import { deleteAPICall, getAPICall } from '../../../util/api';
import ConfirmationModal from '../../common/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';

const AllCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [deleteCustomer, setDeleteCustomer] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { showToast } = useToast();

  // Fetch customer data
  const fetchCustomers = async () => {
    try {
      const response = await getAPICall('/api/customer');
      setCustomers(response);
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle delete confirmation
  const handleDelete = (p) => {
    setDeleteCustomer(p);
    setDeleteModalVisible(true);
  };

  const onDelete = async () => {
    try {
      await deleteAPICall('/api/customer/' + deleteCustomer.id);
      setDeleteModalVisible(false);
      fetchCustomers();
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  const handleEdit = (p) => {
    navigate('/customer/edit/' + p.id);
  };

  const columns = [
    { accessorKey: 'index', header: 'Id' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'mobile', header: 'Mobile' },
    { accessorKey: 'birthdate', header: 'Birthdate' },
    { accessorKey: 'anniversary_date', header: 'Anniversary Date' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ cell }) => (
        <div>
          <CBadge
            role="button"
            color="info"
            onClick={() => handleEdit(cell.row.original)}
          >
            Edit
          </CBadge>
          &nbsp;
          <CBadge
            role="button"
            color="danger"
            onClick={() => handleDelete(cell.row.original)}
          >
            Delete
          </CBadge>
        </div>
      ),
    },
  ];

  const data = customers.map((p, index) => ({
    ...p,
    index: index + 1,
    birthdate: p.birthdate || 'N/A',
    anniversary_date: p.anniversary_date || 'N/A',
  }));

  return (
    <CRow>
      <ConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onYes={onDelete}
        resource={'Delete customer - ' + deleteCustomer?.name}
      />
      <MantineReactTable enableColumnResizing columns={columns} data={data} enableFullScreenToggle={false}/>
    </CRow>
  );
};

export default AllCustomers;
