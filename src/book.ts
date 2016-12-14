/**
 * Class for dealing with a book object.
 */

@component("book-detail")
class Book extends Autofieldable {
  @property({notify: true})
  private book;

  @property()
  private editing: boolean;

  @autofield({label: "Title", path: "book.title", displayValue: emptyReplacer("[no title}")})
  private Title: string;

  @autofield({label: "Authors", path: "book.authors", displayValue: emptyReplacer("[no authors]")})
  private authors: string;

  @autofield({label: "Text", path: "book.text", displayValue: emptyReplacer("[no text]")})
  private text: string;
}

Book.register();
