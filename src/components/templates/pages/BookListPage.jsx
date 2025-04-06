import toast from "react-hot-toast";
import { getAllBooks } from "../../../utils/services";
import Table from "../../modules/Table";
import { useEffect, useState } from "react";
import IsFree from "../../modules/books-list/IsFree";
import SearchAny from "../../modules/books-list/SearchAny";
import MultiFilter from "../../modules/books-list/MultiFilter";
import DetailRow from "../../modules/books-list/DetailRow";
import { MdOutlineLocalOffer } from "react-icons/md";

function BookListPage() {
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageNumber: 1,
    category: "",
    title: "",
    isOffer: null,
  });
  const [data, setData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [detailRow, setDetailRow] = useState(false);
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
  }, []);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setData({ data: [] });

        const bookResponse = await getAllBooks({
          pagination,
        });

        if (!bookResponse) {
          setLoading(false);
        }

        setData(bookResponse || { data: [] });
      } catch (error) {
        toast.error("Error fetching books");
        console.log(error);
        setData({ data: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [pagination]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
  ];

  const filters = (
    <>
      <div>
        <MultiFilter setPagination={setPagination} pagination={pagination} />
        <SearchAny setPagination={setPagination} pagination={pagination} />
      </div>
      <div>
        <IsFree setPagination={setPagination} pagination={pagination} />
      </div>
    </>
  );

  const renderBookRow = (item) => (
    <>
      <tr
        className={`hover:bg-ocean/6 transition-colors duration-400 border-t border-slate-300 overflow-x-hidden cursor-pointer ${
          detailRow === item.id ? "bg-ocean/15 text-bold" : ""
        }`}
        onClick={() =>
          setDetailRow((prev) => (prev === item.id ? null : item.id))
        }
      >
        <td className="pl-2 pr-2 sm:pl-4 lg:pl-4 md:pl-4 border-slate-300">
          {item.id}
        </td>
        <td className="flex p-4 border-slate-300 overflow-hidden whitespace-nowrap text-ellipsis max-w-[250px]">
          {item.isOffer && (
            <span className="p-1 bg-sea rounded text-white mr-1">
              <MdOutlineLocalOffer
                renderRow/>
            </span>
          )}
          {item.isFree && (
            <span className="p-1 bg-green-400 rounded text-white mr-1">
              <TbCurrencyDollarOff />
            </span>
          )}
          {item.title}
        </td>
        <td className="p-4 border-slate-300">{item.category}</td>
      </tr>

      {detailRow === item.id && (
        <tr className="transition-all duration-500 ease-in-out max-h-[500px] opacity-100 overflow-hidden">
          <td colSpan={3}>
            <DetailRow
              author={item.authors}
              tag={item.tags}
              description={item.description}
              end={item.end}
              start={item.freeDay}
              id={item.id}
              title={item.title}
              offer={item.isOffer}
              initialOrder={item.order}
              free={item.isFree}
              renderRow={renderBookRow} // 👈 اینجا
            />
          </td>
        </tr>
      )}
    </>
  );

  return (
    <div>
      <Table
        title="Books List"
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        detailRow={detailRow}
        setDetailRow={setDetailRow}
        customHeaderContent={filters}
        renderRow={renderBookRow}
      />
    </div>
  );
}

export default BookListPage;
