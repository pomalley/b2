/**
 * Widget for looking up data from google books.
 *
 * Queries based on the title and authors of the book parameter.
 * Fires gbooks-entry-selected event when an entry is selected, with event.detail being:
 *   selected: boolean, whether the user selected (true) or deselected (false) this entry
 *   entry: the entry object, with volumeInfo containing the useful stuff.
 */

const GOOGLE_URL = "https://www.googleapis.com/books/v1/volumes";

@component("google-books")
class GoogleBooks extends polymer.Base {

  @property({type: Object})
  public book;

  @property({notify: true, type: Array})
  private results: Object[];

  public handleResponse(event) {
    console.log("ajax response: ", event);
    console.log("event.detail.response: ", event.detail.response);
    // ev = event;
    if (event.detail.response && event.detail.response.totalItems) {
      this.results = event.detail.response.items;
    }
  }

  @listen("gbooks-entry-selected")
  public resultsChanged(a, b, c) {
    console.log("a: ", a);
    console.log("b: ", b);
    console.log("c: ", c);
  }

  @computed()
  public computeParams(book): Object {
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
