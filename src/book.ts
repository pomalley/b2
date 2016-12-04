/**
 * Class for dealing with a book object.
 */

/// <reference path="../bower_components/polymer-ts/polymer-ts.d.ts" />

@component("book-detail")
class Book extends polymer.Base {
    @property({notify: true})
    book: Object;
    @property()
    editing: Boolean;
    @property({computed: "_formatTitle(book.title)"})
    formattedTitle: string;
    @property({computed: "_formatAuthors(book.authors)"})
    formattedAuthors: string;
    @property({computed: "_formatText(book.text)"})
    formattedText: string;

    _formatTitle(title) {
        return title || "[no title]";
    }

    _formatAuthors(authors) {
        if (authors) {
            return "By " + authors;
        }
            return "[no authors]";
    }

    _formatText(text) {
        return text || "[no text]";
    }
}

Book.register();