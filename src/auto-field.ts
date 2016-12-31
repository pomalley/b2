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

  @computed({type: Boolean})
  public isNumber(item) {
    return item.type === Number;
  }

  @computed({type: Boolean})
  public isArray(item) {
    return item.type === Array;
  }

  //noinspection JSMethodCanBeStatic
  @computed({type: Boolean})
  public unknownType(isBoolean, isString, isDate, isNumber, isArray) {
    return !isBoolean && !isString && !isDate && !isNumber && !isArray;
  }

  // overrides fn in IronValidatableBehavior
  public _getValidity() {
    return this.item.validator(this.item.value);
  }

  @listen("input")
  public onChange() {
    //noinspection TsLint - validate() gets added by @behavior, typescript doesn't seem to pick it up
    this["validate"]();
    // handle arrays
    const subitem = this.$$("#newSubitem");
    if (subitem && subitem.value) {
      this.set("item.value",  this.item.value || []);
      this.push("item.value", subitem.value);
      subitem.value = "";
      this.async(() => { this.$$("paper-input:nth-of-type(" + (this.item.value.length) +  ")").focus(); }, 1.0);
    }
    if (this.isArray) {
      const value = this.item.value;
      for (let i = value.length - 1; i >= 0; i--) {
        if (!value[i]) {
          value.splice(i, 1);
        }
      }
      // override the dirty checking (see polymer docs)
      this.set("item.value", []);
      this.set("item.value", value);
    }
  }
}

Field.register();
