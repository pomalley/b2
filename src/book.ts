/**
 * Class for dealing with a book object.
 */

// TODO(pomalley): refactor autofield into new file
interface FieldObj {
  label: string;
  value: any;
}

interface AutofieldConfig {
  label: string;
  path: string;
  propName: string;
}

// @component("auto-fielded")
// @template("")
class Autofielded extends polymer.Base {
  // @property()
  public autofields: FieldObj[];
  public autoconfigs: AutofieldConfig[];
  public addField(fieldConfig: AutofieldConfig) {
    this.autoconfigs = this.autoconfigs || [];
    this.autoconfigs.push(fieldConfig);
  }

  @property()
  protected isReady: boolean;

  constructor() {
    super();
    this.autofields = [];
    for (let autoconfig of this.autoconfigs) {
      this.push("autofields", {label: autoconfig.label, value: "a"});  // TODO(pomalley): value is overwritten, unneeded
    }
  }
}
// Autofielded.register();

function autofield(fieldObj: {label: string, path: string}) {
  return (target: Autofielded, name: string) => {
    target.addField({label: fieldObj.label, path: fieldObj.path, propName: name});
    const n = target.autoconfigs.length - 1;
    // TODO(pomalley): clean this up and move these functions into addField (?)
    target["__autoObserve" + name] = function(newValue) {
      // console.log("auto obs of " + name + " new: " + newValue);
      this.set(fieldObj.path, newValue);
    };
    observe(name)(target, "__autoObserve" + name);

    target["__autoObserve" + fieldObj.path] = function(newValue) {
      // console.log("auto obs of " + fieldObj.path + " new: " + newValue);
      this.set(name, newValue);
      this.set("autofields.#" + n + ".value", newValue);
    };
    observe(fieldObj.path)(target, "__autoObserve" + fieldObj.path);

    target["__autoObserve" + n] = function(newValue) {
      // console.log("auto obs # " + n + " new: " + newValue + " (isready: " + this.isReady + ")");
      if (this.isReady) {
        this.set(fieldObj.path, newValue);
      }
    };
    observe("autofields.#" + n + ".value")(target, "__autoObserve" + n);
    // chain the property decorator
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
  private Title: string;

  @autofield({label: "Authors", path: "book.authors"})
  private authors: string;

  @autofield({label: "text", path: "book.text"})
  private text: string;

  @observe("book")
  private bookChanged(book) {
    console.log("book changed: ", book.title + "|" + book.authors);
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
}

Book.register();
