/**
 * Class for dealing with a book object.
 */

@component("book-detail")
class Book extends Autofieldable {
  @property({notify: true})
  public book;

  @property({type: Boolean})
  public editing: boolean;

  @autofield({label: "Title", path: "book.title", displayValue: emptyReplacer("[no title]")})
  public Title: string;

  @autofield({label: "Authors", path: "book.authors", displayValue: emptyReplacer("[no authors]")})
  public authors: string[];

  @autofield({label: "Year", path: "book.year", displayValue: emptyReplacer("[no year]"), validator: intValidator})
  public year: number;

  @autofield({label: "Subjects", path: "book.subjects", displayValue: emptyReplacer("[no subjects]")})
  public subjects: string[];

  @autofield({label: "Genre", path: "book.genre", displayValue: emptyReplacer("[no genre]")})
  public genre: string[];

  @autofield({path: "book.read", groups: ["personal"]})
  public read: boolean;

  @autofield({path: "book.owned", groups: ["personal"]})
  public owned: boolean = false;

  @autofield({label: "want to read", path: "book.want_to_read", groups: ["personal"]})
  public wantToRead: boolean;

  @autofield({label: "want to own", path: "book.want_to_own", groups: ["personal"]})
  public wantToOwn: boolean;

  @autofield({label: "Comments", path: "book.comments", groups: ["personal"]})
  public comment: string;

  @autofield<string>({
    displayValue: (value: String) => {
      return value ? "Date read: " + value : "[no read date]";
    },
    extraType: "monthDate",
    groups: ["personal"],
    label: "Date Read (YYYY-MM)",
    path: "book.date_read",
    validator: monthDateValidator,
  })
  public dateRead: string;

  public createdTimestampPath() { return "book.date_created"; }
  public updatedTimestampPath() { return "book.date_updated"; }

  @listen("gbooks-entry-selected")
  public entrySelected(event, detail) {
    if (detail.selected) {
      const mine = ["authors", "title", "identifiers", "genre", "imageLinks", "year"];
      const theirs = ["authors", "title", "industryIdentifiers", "categories", "imageLinks", "publishedDate"];
      for (let i = 0; i < mine.length; i++) {
        if (theirs[i] === "publishedDate") {
          // publishedDate can be either YYYY or YYYY-MM-DD
          this.set("book." + mine[i], detail.entry.volumeInfo[theirs[i]].split("-")[0]);
        } else {
          this.set("book." + mine[i], detail.entry.volumeInfo[theirs[i]]);
        }
      }
      this.set("book.gbooksId", detail.entry.id);
    }
  }

  @listen("gbooks-entry-deselected")
  public entryDeselected(event, detail) {
    if (detail.deselected) {
      this.set("book.gbooksId", "");
    }
  }
}

Book.register();
