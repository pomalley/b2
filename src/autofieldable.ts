/**
 * Autofieldable objects will have automatically generated controls for their (annotated) fields.
 */

interface Autofield {
  label: string;
  value: any;
  displayValue: string;
}

interface AutofieldConfig {
  label: string;
  path: string;
  propName: string;
  displayValue?: (value: any) => string;
}

// make a function that replaces an empty string with the given string. for use as a displayValue.
function emptyReplacer(replacement: string) {
  return (value: any) => { return value || replacement; };
}

class Autofieldable extends polymer.Base {
  protected autofields: Autofield[];
  protected autoconfigs: AutofieldConfig[];

  @property()
  private isReady: boolean;

  constructor() {
    super();
    this.autofields = [];
    for (let autoconfig of this.autoconfigs) {
      this.push("autofields", {label: autoconfig.label, value: "a"});  // TODO(pomalley): value is overwritten, unneeded
    }
  }

  public addField(fieldConfig: AutofieldConfig) {
    fieldConfig.displayValue = fieldConfig.displayValue || ((newValue: string) => { return newValue; });
    this.autoconfigs = this.autoconfigs || [];
    this.autoconfigs.push(fieldConfig);
    let n = this.autoconfigs.length - 1;

    // Observers to sync the values.
    // Note that we can't use () => {} notation because this must refer to the instantiated object, not the prototype.
    this["__autoObserve" + fieldConfig.propName] = observeProperty;
    function observeProperty(newValue) {
      this.set(fieldConfig.path, newValue);
    }
    observe(fieldConfig.propName)(this, "__autoObserve" + fieldConfig.propName);

    this["__autoObserve" + fieldConfig.path.split(".").join("_")] = observeOriginal;
    function observeOriginal(newValue) {
      this.set(fieldConfig.propName, newValue);
      this.set("autofields.#" + n + ".value", newValue);
      this.set("autofields.#" + n + ".displayValue", fieldConfig.displayValue(newValue));
    }
    observe(fieldConfig.path)(this, "__autoObserve" + fieldConfig.path.split(".").join("_"));

    this["__autoObserve" + n] = observeArray;
    function observeArray(newValue) {
      if (this.isReady) {
        this.set(fieldConfig.path, newValue);
      }
    }
    observe("autofields.#" + n + ".value")(this, "__autoObserve" + n);
  }
}

function autofield(configurator: {label?: string, path: string, displayValue?: (value: any) => string}) {
  return (target: Autofieldable, name: string) => {
    target.addField({
      displayValue: configurator.displayValue,
      label: configurator.label || name,
      path: configurator.path,
      propName: name,
      });
    // chain the property decorator
    return property()(target, name);
  };
}
