/**
 * Class for dealing with a book object.
 */

@component("book-detail")
class Book extends polymer.Base {
    @property({notify: true})
    private book: Object;
    @property()
    private editing: Boolean;
    @property({computed: "_formatTitle(book.title)"})
    private formattedTitle: string;
    @property({computed: "_formatAuthors(book.authors)"})
    private formattedAuthors: string;
    @property({computed: "_formatText(book.text)"})
    private formattedText: string;

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
