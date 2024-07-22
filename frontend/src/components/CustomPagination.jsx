import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function CustomPagination({
  keyword = "",
  page = 1,
  pages = 1,
  link = "",
  setCurrentPage,
  currentPage,
}) {
  return (
    <Pagination disabled>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={currentPage === 1}
            to={`${link}${keyword}${currentPage === 1 ? 1 : currentPage - 1}`}
            onClick={() =>
              currentPage === 1
                ? setCurrentPage(1)
                : setCurrentPage(currentPage - 1)
            }
          />
        </PaginationItem>
        {[...Array(pages)].map((_, index) => {
          if (pages <= 6) {
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  className={`${
                    currentPage === index + 1
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  to={`${link}${keyword}${index + 1}`}
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={index + 1 === currentPage}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            );
          } else {
            if (
              index === 0 ||
              index === pages - 1 ||
              (index >= currentPage - 2 && index <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    className={`${
                      currentPage === index + 1
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    to={`${link}${keyword}${index + 1}`}
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={index + 1 === currentPage}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (index === 1 && currentPage > 3) {
              return <PaginationEllipsis key={index} />;
            } else if (index === pages - 2 && currentPage < pages - 2) {
              return <PaginationEllipsis key={index} />;
            } else {
              return null;
            }
          }
        })}
        <PaginationItem>
          <PaginationNext
            className={`${
              currentPage === pages ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={currentPage === pages}
            to={`${link}${keyword}${
              currentPage === pages ? pages : currentPage + 1
            }`}
            onClick={() =>
              currentPage === pages
                ? setCurrentPage(pages)
                : setCurrentPage(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default CustomPagination;
