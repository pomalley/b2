/**
 * Class for dealing with a book object.
 */

@component("book-detail")
class Book extends Autofieldable {
  @property({notify: true})
  private book;

  @property({type: Boolean})
  private editing: boolean;

  @autofield({label: "Title", path: "book.title", displayValue: emptyReplacer("[no title}")})
  private Title: string;

  @autofield({label: "Authors", path: "book.authors", displayValue: emptyReplacer("[no authors]")})
  private authors: string;

  @autofield({label: "Text", path: "book.text", displayValue: emptyReplacer("[no text]")})
  private text: string;

  @autofield({path: "book.read", groups: ["personal"]})
  private read: boolean;

  @autofield({path: "book.owned"})
  private owned: boolean = false;

  @autofield({label: "want to read", path: "book.wantToRead", groups: ["personal"]})
  private wantToRead: boolean;

  @autofield({label: "want to own", path: "book.wantToOwn", groups: ["personal"]})
  private wantToOwn: boolean;
}

Book.register();
