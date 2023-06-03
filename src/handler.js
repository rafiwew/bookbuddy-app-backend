const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    category,
    overview,
    publisher,
    originalLanguage,
    pageCount,
    posterPath,
    voteAverage,
  } = request.payload;

  const id = nanoid(15);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    category,
    overview,
    publisher,
    originalLanguage,
    pageCount,
    posterPath,
    voteAverage,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else {
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length === 1;

    if (isSuccess) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }

    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku",
    });
    response.code(400);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let bookFilter = books;

  if (name) {
    const nameRegex = new RegExp(name, "i");
    bookFilter = bookFilter.filter((book) => nameRegex.test(book.name));
  }

  const response = h.response({
    status: "success",
    data: {
      books: bookFilter.map((book) => ({
        id: book.id,
        name: book.name,
        year: book.year,
        author: book.author,
        category: book.category,
        overview: book.overview,
        publisher: book.publisher,
        posterPath: book.posterPath,
        voteAverage: book.voteAverage,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    category,
    overview,
    publisher,
    originalLanguage,
    pageCount,
    posterPath,
    voteAverage,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else {
    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      });
      response.code(404);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      category,
      overview,
      publisher,
      originalLanguage,
      pageCount,
      posterPath,
      voteAverage,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
