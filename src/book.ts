/**
 * Class for dealing with a book object.
 */

interface FieldObj {
  label: string;
  value: any;
}

@component("auto-fielded")
// @template("")
class Autofielded extends polymer.Base {
  @property()
  private autofields: FieldObj[];
  public addField(fieldObj: FieldObj) {
    this.autofields = this.autofields || [];
    // this.push("autofields", fieldObj);
    this.autofields.push(fieldObj);
    console.log(fieldObj);
    console.log(this.autofields);
  }
}
// Autofielded.register();

function autofield(fieldObj: {label: string, path: string}) {
  return (target: Autofielded, name: string) => {
    target.addField({label: fieldObj.label, value: 1});
    // target.addField({label: fieldObj.label, value: target[fieldObj.path]});
    // chain the @property decorator on this.
    return property()(target, name);
  };
}

@component("book-detail")
class Book extends Autofielded {
  @property({notify: true})
  private book;

  @property()
  private editing: boolean;

  @property({computed: "_formatTitle(book.title)"})
  private formattedTitle: string;

  @property({computed: "_formatAuthors(book.authors)"})
  private formattedAuthors: string;

  @property({computed: "_formatText(book.text)"})
  private formattedText: string;

  @autofield({label: "Title", path: "book.title"})
  private Title: String;

  @observe("fields.#0.value")
  private listTitleChanged(newValue) {
    this.set("book.title", newValue);
  }

  @observe("book")
  private bookChanged(book) {
    console.log("book changed");
    // this.fields = [{value: this.book.title, label: "Title"}];
    this.linkPaths("autofields.#0.value", "book.title");
  }

  private _formatTitle(title) {
    return title || "[no title]";
  }
  private _formatAuthors(authors) {
    if (authors) {
      return "By " + authors;
    }
    return "[no authors]";
  }
  private _formatText(text) {
    return text || "[no text]";
  }

  public ready() {
    this.addField({label: "InReady", value: "hum"});
  }

}

Book.register();
