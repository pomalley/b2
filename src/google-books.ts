/**
 * Widget for looking up and displaying data from google books.
 *
 * If gbooksId _not_ is provided:
 *   Queries based on the title and authors of the book parameter.
 *   Fires gbooks-entry-selected event when an entry is selected, with event.detail being:
 *     selected: boolean, whether the user selected (true) or deselected (false) this entry
 *     entry: the entry object, with volumeInfo containing the useful stuff.
 * If it is:
 *   Looks up google books entry of that id.
 *   Fires gbooks-entry-deselected event if the user chooses to de-select that entry.
 */

@component("google-books")
class GoogleBooks extends polymer.Base {

  @property({type: Object})
  public book;

  @property({notify: true, type: Array})
  private results: Object[];

  @property({notify: true, type: Object})
  private lookupResult: Object;

  /**
   * If provided, this puts the element in "lookup mode" (see below).
   */
  @property({type: String})
  private gbooksId: string;

  /**
   * If true, the element is in "search mode"--query based on book params to find a new book.
   * If false, "lookup mode"--user has already selected a book, and we just look up its details.
   */
  @computed()
  private searchMode(gbooksId) {
    return !gbooksId;
  }

  @computed()
  private resultsFound(results) {
    return results.length > 0;
  }

  private handleResponse(event) {
    if (this.searchMode && event.detail.response && event.detail.response.totalItems) {
      this.results = event.detail.response.items;
    }
    if (!this.searchMode && event.detail.response && event.detail.response.volumeInfo) {
      this.lookupResult = event.detail.response;
    }
  }

  @computed()
  private computeParams(book): Object {
    let qString = "";
    if (book.title) {
      qString += "+intitle:" + book.title;
    }
    if (book.authors) {
      for (let author of book.authors) {
        qString += "+inauthor:" + author;
      }
    }
    if (qString) {
      return {q: qString};
    }
    return {};
  }
}

GoogleBooks.register();
