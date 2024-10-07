import Image from "next/image";
import { HiOutlinePencil, HiOutlinePencilSquare } from "react-icons/hi2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Common/Modal";
import UploadImg from "../Components/UploadImg";
import { Category } from "@prisma/client";
import { useMutation } from "@urql/next";
import { EditCategoryDocument } from "@/graphql/generated"; // Adjust the import path as necessary
import { Toaster, toast } from "react-hot-toast"; // Import react-hot-toast for notifications
import { SupabaseImageUpload } from "@/lib/supabaseStorage";

type Props = {
  cat: Category;
};

const AdminEditCategory = ({ cat }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(cat.title);
  const [desc, setDesc] = useState(cat.desc);
  const [image, setImage] = useState(cat.img);
  const [isSubmitting, setIsSubmitting] = useState(false); // Manage form submission state

  // GraphQL mutation to edit a category
  const [, editCategory] = useMutation(EditCategoryDocument);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  // Callback to handle image file upload
  const getCategoryImgFile = async (file: File) => {
    try {
      const imageUrl = await SupabaseImageUpload(file); // Upload the image to Supabase and get URL
      setImage(imageUrl); // Set the new image URL after uploading
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !desc || !image) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true); // Disable button while submitting

    try {
      // Perform mutation to update the category
      const response = await editCategory({
        editCategoryId: cat.id, // Pass the category ID to the mutation
        title,
        desc,
        img: image, // Use the updated image URL
      });

      if (response.error) {
        console.error(response.error.message);
        toast.error("Failed to update the category.");
      } else {
        toast.success("Category updated successfully!");
        closeModal();
        router.refresh(); // Refresh the page or category list after editing
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the category.");
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <>
  
      {/* Edit button/icon */}
      <HiOutlinePencilSquare
        onClick={openModal}
        className="cursor-pointer h-6 w-6 text-green-600"
      />

      {/* Modal for editing the category */}
      <Modal isOpen={isOpen} title={`Edit: ${cat.title}`} closeModal={closeModal}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            {/* Image preview */}
            <div className="sm:col-span-2 border-gray-300">
              <Image
                src={image}
                alt={cat.title}
                width={360}
                height={200}
                className="h-16 w-16 object-cover rounded-md"
              />
            </div>

            {/* Title input */}
            <div>
              <label htmlFor="name" className="form-label">
                Title
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description input */}
            <div>
              <label htmlFor="desc" className="form-label">
                Description
              </label>
              <input
                type="text"
                name="desc"
                id="desc"
                className="form-input"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>

          {/* Upload new image */}
          <UploadImg handleCallBack={getCategoryImgFile} id="editCategory" />

          {/* Submit button */}
          <button
            type="submit"
            className="text-white inline-flex items-center bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting} // Disable button during submission
          >
            {isSubmitting ? "Updating..." : (
              <>
                <HiOutlinePencil className="mr-1 -ml-1 w-4 h-4" fill="currentColor" />
                Edit Category
              </>
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AdminEditCategory;
