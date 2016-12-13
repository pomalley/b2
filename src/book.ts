/**
 * Class for dealing with a book object.
 */

@component("book-detail")
class Book extends Autofieldable {
  @property({notify: true})
  private book;

  @property()
  private editing: boolean;

  // @property({computed: "_formatTitle(book.title)"})
  // private formattedTitle: string;

  // @property({computed: "_formatAuthors(book.authors)"})
  // private formattedAuthors: string;

  // @property({computed: "_formatText(book.text)"})
  // private formattedText: string;

  @autofield({label: "Title", path: "book.title"})
  private Title: string;

  @autofield({path: "book.authors"})
  private authors: string;

  @autofield({label: "text", path: "book.text"})
  private text: string;

  // @observe("book")
  // private bookChanged(book) {
  //   console.log("book changed: ", book.title + "|" + book.authors);
  // }

  // private _formatTitle(title) {
  //   return title || "[no title]";
  // }
  // private _formatAuthors(authors) {
  //   if (authors) {
  //     return "By " + authors;
  //   }
  //   return "[no authors]";
  // }
  // private _formatText(text) {
  //   return text || "[no text]";
  // }
}

Book.register();
