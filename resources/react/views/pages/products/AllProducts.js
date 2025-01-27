import React, { useEffect, useState } from 'react';
import { CBadge, CRow } from '@coreui/react';
import { MantineReactTable } from 'mantine-react-table';
import { deleteAPICall, getAPICall, putAPICall } from '../../../util/api';
import ConfirmationModal from '../../common/ConfirmationModal';
import EditModal from '../../common/EditModal';
import { useToast } from '../../common/toast/ToastContext';

const AllProducts = () => {
  const [products, setProducts] = useState([]); // Stores products data
  const [editProductSize, setEditProductSize] = useState(null); // For editing size
  const [deleteProductSize, setDeleteProductSize] = useState(null); // For deleting size
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Delete modal visibility
  const [editModalVisible, setEditModalVisible] = useState(false); // Edit modal visibility
  const { showToast } = useToast(); // Toast notifications

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await getAPICall('/api/product'); // API call to fetch products
      setProducts(response);
    } catch (error) {
      showToast('danger', `Error fetching products: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle delete size
  const handleDeleteSize = (size) => {
    setDeleteProductSize({
      sizeId: size.sizeId,
      sizeName: size.size,
      productName: size.name,
    });
    setDeleteModalVisible(true); // Show delete confirmation modal
  };

  // Delete a specific product size
  const onDeleteSize = async () => {
    try {
      if (deleteProductSize && deleteProductSize.sizeId) {
        await deleteAPICall(`/api/product/size/${deleteProductSize.sizeId}`); // API call to delete size
        setDeleteModalVisible(false); // Hide modal
        fetchProducts(); // Refresh products list
        showToast('success', `Size "${deleteProductSize.sizeName}" deleted successfully.`);
      }
    } catch (error) {
      showToast('danger', `Error deleting size: ${error.message}`);
    }
  };

  // Handle edit size
  const handleEditSize = (size) => {
    setEditProductSize(size); // Pass size details to edit modal
    setEditModalVisible(true); // Show edit modal
  };

  // Update a specific product size
  const onUpdateSize = async (updatedSize) => {
    try {
      await putAPICall(`/api/product/size/${updatedSize.sizeId}`, {
        size: updatedSize.size,
        qty: updatedSize.quantity,
        oPrice: updatedSize.sellingPrice,
      }); // API call to update size
      setEditModalVisible(false); // Hide edit modal
      fetchProducts(); // Refresh products list
      showToast('success', `Size "${updatedSize.size}" updated successfully.`);
    } catch (error) {
      showToast('danger', `Error updating size: ${error.message}`);
    }
  };

  // Define columns for MantineReactTable
  const columns = [
    { accessorKey: 'name', header: 'Product Name' },
    { accessorKey: 'size', header: 'Size' },
    { accessorKey: 'sellingPrice', header: 'Selling Price' },
    { accessorKey: 'quantity', header: 'Quantity' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ cell }) => (
        <div>
          <CBadge
            role="button"
            color="info"
            onClick={() => handleEditSize(cell.row.original)}
          >
            Edit
          </CBadge>
          &nbsp;
          <CBadge
            role="button"
            color="danger"
            onClick={() => handleDeleteSize(cell.row.original)}
          >
            Delete
          </CBadge>
        </div>
      ),
    },
  ];

  // Flatten product data to handle sizes
  const flattenProductData = (products) =>
    products.flatMap((product) =>
      product.sizes?.map((size) => ({
        ...product, // Retain product-level data
        size: size.size, // Map size details
        sellingPrice: size.oPrice,
        quantity: size.qty,
        sizeId: size.id, // Use sizeId for size-specific actions
      })) || []
    );

  const data = flattenProductData(products); // Prepare data for table

  return (
    <CRow>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onYes={onDeleteSize}
        resource={`Delete size "${deleteProductSize?.sizeName}" from product "${deleteProductSize?.productName}"?`}
      />

      {/* Edit Size Modal */}
      <EditModal
        visible={editModalVisible}
        setVisible={setEditModalVisible}
        size={editProductSize} // Pass size data to modal
        onSave={onUpdateSize} // Function to update size
      />

      {/* Product Table */}
      <MantineReactTable columns={columns} data={data} enableFullScreenToggle={false} />
    </CRow>
  );
};

export default AllProducts;
