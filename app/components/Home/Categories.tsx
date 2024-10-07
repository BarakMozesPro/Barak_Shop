"use client";

import { useQuery } from "@urql/next";
import Image from "next/image";
import {
  GetCategoriesDocument,
  GetCategoriesQuery,
  GetCategoriesQueryVariables,
} from "@/graphql/generated";
import Loading from "../../loading";
import { toast } from "react-hot-toast";
import { useCategoryStore } from "../../../lib/store";

const Categories = () => {
  const setSelectedCategoryId = useCategoryStore((state) => state.setSelectedCategoryId);

  const [{ data, fetching, error }] = useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>({
    query: GetCategoriesDocument,
  });

  if (fetching) return <Loading />;
  if (error) {
    toast.error("Failed to load categories.");
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  const categories = data?.getCategories;

  if (!categories?.length) {
    return <p className="text-gray-500">No categories found.</p>;
  }

  return (
    <section className="my-16">
      <div className="max-w-2xl mx-auto my-5 text-center">
        <h2 className="text-3xl leading-tight tracking-tight text-gray-600 sm:text-4xl">
          Categories
        </h2>
      </div>

      {/* Categories Grid */}
      <div className="flex flex-wrap justify-center gap-8 mt-12">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center justify-center p-3 cursor-pointer rounded-full overflow-hidden transition-transform hover:scale-105"
            aria-label={cat.title}
            onClick={() => setSelectedCategoryId(cat.id)}
          >
            <Image
              src={cat.img}
              width={60}
              height={60}
              alt={`${cat.title} category`}
              className="rounded-full"
            />
            <h3 className="text-sm text-center mt-2 text-gray-600">{cat.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
