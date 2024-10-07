import { HiPlus } from "react-icons/hi2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Common/Modal";
import UploadImg from "../Components/UploadImg"; // Adjust import path as necessary
import { useMutation } from "@urql/next";
import { AddCategoryDocument } from "@/graphql/generated";
import { SupabaseImageUpload } from "@/lib/supabaseStorage";// Import your Supabase image upload function
import { toast } from "react-hot-toast"; // Import react-hot-toast

const AdminAddCategory = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<File | null>(null); // Image file
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state

  // Mutation to add a category
  const [, addCategory] = useMutation(AddCategoryDocument);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  // Callback function to handle image selection
  const getCategoryImgFile = (file: File) => {
    setImage(file); // Set the uploaded image file
  };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!title || !desc || !image) {
        toast.error("Please fill in all fields."); // Error toast if fields are missing
        return;
      }
  
      setIsSubmitting(true); // Set submission state to true
  
      try {
        // First, upload the image to Supabase and get the public URL
        const imageUrl = await SupabaseImageUpload(image);
  
        // Then, perform the mutation to add the category
        const response = await addCategory({
          title,
          desc, // Use correct variable name here
          img: imageUrl, // Use the image URL returned from Supabase
        });
  
        if (response.error) {
          console.error(response.error.message);
          toast.error("Failed to add category."); // Error toast for mutation failure
        } else {
          toast.success("Category added successfully!"); // Success toast
          closeModal();
          router.refresh(); // Refresh the page or category list after adding
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image or add category."); // Error toast for image upload failure
      } finally {
        setIsSubmitting(false); // Reset submission state
      }
    };
  return (
    <>
      <button
        type="button"
        className="text-white inline-flex items-center whitespace-nowrap bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        onClick={openModal}
      >
        <HiPlus className="mr-1 -ml-1 w-4 h-4" />
        Add Category
      </button>

      <Modal isOpen={isOpen} title="Add New Category" closeModal={closeModal}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
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

          <UploadImg handleCallBack={getCategoryImgFile} id="addCategory" />

          <button
            type="submit"
            className="text-white inline-flex items-center bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? (
              <span>Submitting...</span> // Spinner or text to show during submission
            ) : (
              <>
                <HiPlus className="mr-1 -ml-1 w-4 h-4" fill="currentColor" />
                Add Category
              </>
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AdminAddCategory;
