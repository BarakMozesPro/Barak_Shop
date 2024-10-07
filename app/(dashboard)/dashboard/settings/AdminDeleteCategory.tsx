import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Common/Modal";
import { useMutation } from "@urql/next";
import { DeleteCategoryDocument } from "@/graphql/generated"; // Adjust the import as necessary
import { Toaster, toast } from "react-hot-toast"; // Import react-hot-toast for notifications

type AdminDeleteCategoryProps = {
  categoryId: string;
  categoryName: string;
};

const AdminDeleteCategory = ({ categoryId, categoryName }: AdminDeleteCategoryProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State to manage deletion

  // GraphQL mutation to delete a category
  const [, deleteCategory] = useMutation(DeleteCategoryDocument);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  // Handle deletion
  const handleDelete = async () => {
    setIsDeleting(true); // Set deleting state to true

    try {
      // Perform delete mutation
      const response = await deleteCategory({
        deleteCategoryId: categoryId, // Pass the categoryId as a variable
      });

      if (response.error) {
        console.error(response.error.message);
        toast.error("Failed to delete the category."); // Show error toast
      } else {
        toast.success("Category deleted successfully!"); // Show success toast
        closeModal();
        router.refresh(); // Refresh the page or category list
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the category.");
    } finally {
      setIsDeleting(false); // Reset deleting state
    }
  };

  return (
    <>

      {/* Delete button/icon */}
      <HiOutlineTrash
        onClick={openModal}
        className="cursor-pointer h-6 w-6 text-red-500"
      />

      {/* Modal for delete confirmation */}
      <Modal isOpen={isOpen} title={categoryName} closeModal={closeModal}>
        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative p-4 text-center bg-white">
            <HiOutlineTrash
              className="text-gray-400 w-11 h-11 mb-3.5 mx-auto"
              aria-hidden="true"
            />
            <p className="mb-4 text-gray-500">
              Are you sure you want to delete <strong>{categoryName}</strong>?
            </p>
            <div className="flex justify-center items-center space-x-4">
              {/* Cancel button */}
              <button
                onClick={closeModal}
                type="button"
                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none hover:text-gray-900"
              >
                No, cancel
              </button>

              {/* Confirm delete button */}
              <button
                onClick={handleDelete}
                type="button"
                className="py-2 px-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                disabled={isDeleting} // Disable button while deleting
              >
                {isDeleting ? "Deleting..." : "Yes, I'm sure"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminDeleteCategory;
