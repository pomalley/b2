/**
 * Implementation of a generic field.
 */

@component("auto-field")
@behavior(Polymer["IronValidatableBehavior"])
class Field extends polymer.Base {
  // true to display editable fields, false for read-only
  @property()
  public editing: boolean;

  // validity of current user input
  @property({notify: true})
  public invalid: boolean;

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

  // overrides fn in IronValidatableBehavior
  public _getValidity() {
    return this.item.validator(this.item.value);
  }

  @listen("input")
  public onChange() {
    //noinspection TsLint
    this["validate"]();  // validate() gets added by @behavior, typescript doesn't seem to pick it up
  }
}

Field.register();
