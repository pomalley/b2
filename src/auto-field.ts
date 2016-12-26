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

  //noinspection JSMethodCanBeStatic
  @computed({type: Boolean})
  public isBoolean(item) {
    return item.type === Boolean;
  }

  //noinspection JSMethodCanBeStatic
  @computed({type: Boolean})
  public isString(item) {
    return item.type === String;
  }

  @computed({type: Boolean})
  public isDate(item) {
    return item.type === Date;
  }

  //noinspection JSMethodCanBeStatic
  @computed({type: Boolean})
  public unknownType(isBoolean, isString, isDate) {
    return !isBoolean && !isString && !isDate;
  }
}

Field.register();
