"use client";

import React, { Suspense, useState, useCallback } from "react";
import MenuModal from "./MenuModal";
import { GetMenusDocument, GetMenusQuery, GetMenusQueryVariables } from "@/graphql/generated";
import { useQuery } from "@urql/next";
import Loading from "../Common/ClientLoaders";
import { Menu, User } from "@prisma/client";
import { useCategoryStore } from "../../../lib/store";

type FetchedMenuProps = {
  variables: GetMenusQueryVariables;
  onLoadMore: (after: string) => void;
  user: User;
};

const FetchedMenus = ({ variables, onLoadMore, user }: FetchedMenuProps) => {
  const [{ data, fetching, error }] = useQuery<GetMenusQuery, GetMenusQueryVariables>({
    query: GetMenusDocument,
    variables: variables,  // Pass the variables that include categoryId
  });

  if (fetching) return <Loading />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const menus = data?.getMenus.edges;
  const endCursor = data?.getMenus.pageInfo.endCursor;
  const hasNextPage = data?.getMenus.pageInfo.hasNextPage;

  return (
    <>
      {!menus || menus.length === 0 ? (
        <div className="text-center py-3">
          <h2 className="text-lg leading-tight tracking-tight text-gray-600">...No Menus Found</h2>
        </div>
      ) : (
        <div className="mb-24 space-y-5">
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {menus?.map((MenuEdge) => (
              <MenuModal key={MenuEdge?.node.id} menu={MenuEdge?.node as Menu} user={user} />
            ))}
          </div>
          {hasNextPage && (
            <button
              onClick={() => onLoadMore(endCursor as string)}
              className="bg-green-600 text-white text-center hover:bg-green-200 hover:text-green-700 p-3 rounded focus:outline-none"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </>
  );
};

type MenuSectionProps = {
  user: User;
};

const MenuSection = ({ user }: MenuSectionProps) => {
  const selectedCategoryId = useCategoryStore((state) => state.selectedCategoryId); // Get the selected category ID
  const [pageVariables, setPageVariables] = useState([
    {
      first: 4,
      after: null as string | null,
      categoryId: selectedCategoryId,  // Pass categoryId here to filter menus
    },
  ]);

  const handleLoadMore = useCallback(
    (after: string) => {
      setPageVariables((prev) => [...prev, { first: 4, after, categoryId: selectedCategoryId }]);
    },
    [setPageVariables, selectedCategoryId]
  );

  return (
    <section className="mb-24 flex flex-col items-center md:justify-center">
      <div className="text-center">
        <h2 className="text-3xl leading-tight tracking-tight text-gray-600 sm:text-4xl">Menu</h2>

        {pageVariables.map((variables, i) => (
          <FetchedMenus
            key={variables.after || i}
            user={user}
            variables={variables}
            onLoadMore={handleLoadMore}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
