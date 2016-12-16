/**
 * Autofieldable objects will have automatically generated controls for their (annotated) fields.
 */

// import "../node_modules/reflect-metadata/reflect-metadata.d.ts";
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />

interface Autofield {
  label: string;
  value: any;
  displayValue: string;
  type: any;
}

interface AutofieldConfig {
  label: string;
  path: string;
  propName: string;
  displayValue?: (value: any) => string;
  groups: string[];
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
      // TODO(pomalley): value is overwritten, unneeded
      this.push("autofields", {
        label: autoconfig.label,
        type: this["properties"][autoconfig.propName].type,
        value: "a",
      });
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

function autofield(conf: {path: string, label?: string, displayValue?: (value: any) => string, groups?: string[]}) {
  return (target: Autofieldable, name: string) => {
    let t = Reflect.getMetadata("design:type", target, name);

    target.addField({
      displayValue: conf.displayValue,
      groups: conf.groups || [],
      label: conf.label || name,
      path: conf.path,
      propName: name,
    });
    // chain the property decorator
    return property({type: t})(target, name);
  };
}
