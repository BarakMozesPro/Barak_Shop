"use client";

import Image from "next/image";

import AdminAddCategory from "./AdminAddCategory";
import AdminEditCategory from "./AdminEditCategory";
import AdminDeleteCategory from "./AdminDeleteCategory";

// import { categoriesData } from "@/data/categories-data";
import { Category } from "@prisma/client";

import { useQuery } from "@urql/next";

import {
  GetCategoriesDocument,
  GetCategoriesQuery,
  GetCategoriesQueryVariables,
} from "@/graphql/generated";
import Loading from "../loading";

const AdminCategories = () => {
  // Fetch categories using the generated types
  const [{ data: CategoriesData, fetching, error }] = useQuery<
    GetCategoriesQuery,
    GetCategoriesQueryVariables
  >({
    query: GetCategoriesDocument,
  });

  if (fetching) return <Loading></Loading>;
  if (error) return <p>Error: {error.message}</p>;

  const categories = CategoriesData?.getCategories;
  return (
   
    <>
    <div className="flex items-center justify-around ">
      <h2 className="text-2xl py-4 leading-tight tracking-tight text-gray-600 ">
        Categories
      </h2>
      <AdminAddCategory />
    </div>
    <table className="w-full text-left text-slate-500">
      <thead className="text-xs overflow-x-auto whitespace-nowrap text-slate-700 uppercase bg-slate-100">
        <tr>
          <th scope="col" className="px-6 py-3">Image</th>
          <th scope="col" className="px-6 py-3">Title</th>
          <th scope="col" className="px-6 py-3">Description</th>
          <th scope="col" className="px-6 py-3">Edit</th>
          <th scope="col" className="px-6 py-3">Delete</th>
        </tr>
      </thead>
      <tbody>
        {categories?.map((cat) => (
          <tr className="bg-white" key={cat.id}>
            <td className="px-6 py-2">
              <Image
                src={cat.img}
                width={50}
                height={50}
                alt="category-image"
                className="rounded-md object-cover"
              />
            </td>
            <td className="px-6 py-2">{cat.title}</td>
            <td className="px-6 py-2">{cat.desc}</td>
            <td className="px-6 py-2 whitespace-nowrap">
              <AdminEditCategory cat={cat} />
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
            <AdminDeleteCategory categoryId={cat.id} categoryName={cat.title} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
  );
  
};

export default AdminCategories;
