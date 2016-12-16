/**
 * Implementation of a generic field.
 */

@component("auto-field")
class Field extends polymer.Base {
  // true to display editable fields, false for read-only
  @property()
  public editing: boolean;

  // the item itself.
  @property({notify: true})
  public item: Autofield;

  @computed()
  public isBoolean(item) {
    return item.type === Boolean;
  }

  @computed()
  public isString(item) {
    return item.type === String;
  }
}

Field.register();
