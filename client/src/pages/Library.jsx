import { useEffect, useState } from "react";
import { fetchJson } from "../api/http";
import { FiX } from "react-icons/fi";

const PLACEHOLDER_COVER = (title) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='420'%3E%3Crect fill='%23F0EDE8' width='300' height='420' rx='4'/%3E%3Crect x='20' y='20' width='260' height='380' fill='%23E8E3DB' rx='2'/%3E%3Ctext fill='%23887755' x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' font-size='16' font-weight='bold' font-family='serif'%3E${encodeURIComponent(title.split(' ').slice(0, 3).join(' '))}%3C/text%3E%3Ctext fill='%23AA9977' x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='12' font-family='serif'%3EBook Cover%3C/text%3E%3C/svg%3E`;

const HERO_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0.4' y2='1'%3E%3Cstop offset='0%25' stop-color='%23222'/%3E%3Cstop offset='100%25' stop-color='%23444'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1400' height='600'/%3E%3Ctext fill='%23777' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24'%3ELibrary Hero — Replace via Admin%3C/text%3E%3C/svg%3E";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchJson("/api/books")
      .then((d) => setBooks(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // Split: first 2 are "MY BOOKS", rest are "CURRENTLY IN MY LIBRARY"
  const myBooks = books.slice(0, 2);
  const libraryBooks = books.slice(2);

  // Spotlight book (first book by default)
  const spotlight = books[0];

  return (
    <div className="bg-white text-gray-900">
      {/* ═══════════════════════════════════════
          HERO — B&W image
          ═══════════════════════════════════════ */}
      <section className="relative w-full" style={{ height: "55vh", minHeight: 380 }}>
        <img
          src={HERO_IMG}
          alt="Library"
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(100%) contrast(1.1)" }}
        />
      </section>

      {/* ═══════════════════════════════════════
          MY BOOKS — 2 featured books
          ═══════════════════════════════════════ */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-sm font-normal tracking-[0.15em] text-gray-400 uppercase mb-8">
            MY BOOKS
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {myBooks.map((book) => (
              <BookCard key={book._id} book={book} onClick={() => setSelectedBook(book)} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BOOK SPOTLIGHT — Featured book with description + image
          ═══════════════════════════════════════ */}
      {spotlight && (
        <section className="py-12 px-4 bg-white">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-[11px] font-normal tracking-[0.15em] text-gray-400 uppercase mb-2">
              BOOK SPOTLIGHT
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Left — text */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase leading-tight">
                  {spotlight.title}
                </h3>
                <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                  {spotlight.description || "A must-read book recommended by Bolaji Sotunde for professionals seeking to grow their leadership and impact."}
                </p>
              </div>

              {/* Right — image placeholder */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm aspect-[4/3] bg-gray-100 rounded-sm overflow-hidden">
                  <img
                    src={HERO_IMG}
                    alt="Book Spotlight"
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(100%)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          CURRENTLY IN MY LIBRARY — 4-column grid
          ═══════════════════════════════════════ */}
      {libraryBooks.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-sm font-normal tracking-[0.15em] text-gray-400 uppercase mb-8">
              CURRENTLY IN MY LIBRARY
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {libraryBooks.map((book) => (
                <BookCard key={book._id} book={book} onClick={() => setSelectedBook(book)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          BOOK POPUP MODAL
          ═══════════════════════════════════════ */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-700 z-10"
            >
              <FiX size={18} />
            </button>

            <div className="p-8">
              {/* Book cover */}
              <div className="w-32 h-44 bg-gray-100 rounded overflow-hidden mb-6 border border-gray-200">
                <img
                  src={selectedBook.coverImage || PLACEHOLDER_COVER(selectedBook.title)}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 uppercase">
                {selectedBook.title}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {selectedBook.author}
              </p>

              {/* Description */}
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                {selectedBook.description || "A recommended read by Bolaji Sotunde. More details coming soon."}
              </p>

              {/* Purchase link */}
              {selectedBook.purchaseLink && (
                <a
                  href={selectedBook.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 text-xs font-medium text-red-500 hover:text-red-600 tracking-wider transition"
                >
                  GET THIS BOOK &raquo;
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Book Card Component ── */
function BookCard({ book, onClick }) {
  return (
    <div className="group cursor-pointer text-center" onClick={onClick}>
      {/* Cover Image */}
      <div className="bg-gray-100 rounded-sm p-4 border border-gray-100 group-hover:border-gray-300 group-hover:shadow-lg transition-all duration-300 mx-auto inline-block">
        <div className="w-36 h-52 sm:w-40 sm:h-56 overflow-hidden mx-auto">
          <img
            src={book.coverImage || PLACEHOLDER_COVER(book.title)}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Title + Author */}
      <h3 className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-900 leading-snug group-hover:text-red-600 transition-colors">
        {book.title}
      </h3>
      <p className="mt-0.5 text-xs text-red-500">
        {book.author}
      </p>
    </div>
  );
}
