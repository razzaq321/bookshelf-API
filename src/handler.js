const { nanoid } = require("nanoid");
const books = require("./books");

// Menambahkan buku
const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
     } = request.payload;

     const id = nanoid(16);
     const finished = pageCount === readPage;
     const insertedAt = new Date().toISOString();
     const updatedAt = insertedAt;

     const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
     };

     if (!name) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        }).code(400);
     }
     if (readPage > pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400);
     }

     books.push(newBook);

     const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
         bookId: id,
        },
     }).code(201);

     return response;
};

// Menampilkan seluruh buku dan fitur query parameters
const getAllBooksHandler = (request, h) => {
   const { name, reading, finished } = request.query;

   let filteredBooks = books;

   if (name !== undefined) {
     filteredBooks = filteredBooks.filter((book) => book
       .name.toLowerCase().includes(name.toLowerCase()));
   }

   if (reading !== undefined) {
     filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
   }

   if (finished !== undefined) {
     filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
   }

   const response = h.response({
     status: "success",
     data: {
       books: filteredBooks.map((book) => ({
         id: book.id,
         name: book.name,
         publisher: book.publisher,
       })),
     },
   }).code(200);

   return response;
 };

// Menampilkan buku byId
const getBookByIdHandler = (request, h) => {
   const { bookId } = request.params;
   const book = books.find((b) => b.id === bookId);

   if (book) {
      return h.response({
         status: "success",
         data: {
            book,
         },
      }).code(200);
   }

   return h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
   }).code(404);
};

// Mengubah/edit buku
const editBookByIdHandler = (request, h) => {
   const { bookId } = request.params;
   const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
   } = request.payload;

   const bookIndex = books.findIndex((b) => b.id === bookId);

   if (bookIndex !== -1) {
      if (!name) {
        return h.response({
          status: "fail",
          message: "Gagal memperbarui buku. Mohon isi nama buku",
        }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({
          status: "fail",
          message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400);
      }

      // update buku
      books[bookIndex] = {
         ...books[bookIndex],
         name,
         year,
         author,
         summary,
         publisher,
         pageCount,
         readPage,
         reading,
         updatedAt: new Date().toISOString(),
      };

      return h.response({
         status: "success",
         message: "Buku berhasil diperbarui",
      }).code(200);
}
   return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
   }).code(404);
};

// Menghapus buku berdasarkan ID
const deleteBookByIdHandler = (request, h) => {
   const { bookId } = request.params;
   const bookIndex = books.findIndex((book) => book.id === bookId);
   if (bookIndex !== -1) {
      books.splice(bookIndex, 1);

      return h.response({
         status: "success",
         message: "Buku berhasil dihapus",
      }).code(200);
   }
   return h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
   }).code(404);
};

module.exports = {
   addBooksHandler,
   getAllBooksHandler,
   getBookByIdHandler,
   editBookByIdHandler,
   deleteBookByIdHandler,
};
