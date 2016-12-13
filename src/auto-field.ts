/**
 * Implementation of a generic field.
 */

@component("auto-field")
class Field extends polymer.Base {
  @property()
  public input: boolean;

  @property({notify: true})
  public value: string;

  @property()
  public label: string;
}

Field.register();
