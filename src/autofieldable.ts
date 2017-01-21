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
  validator: (value: any) => boolean;
}

interface AutofieldConfig<T> {
  label: string;
  path: string;
  propName: string;
  displayValue: (value: T) => string;
  groups: string[];
  validator: (value: T) => boolean;
}

// make a function that replaces an empty string with the given string. for use as a displayValue.
function emptyReplacer(replacement: string) {
  return (value: any) => { return value || replacement; };
}

function monthDateValidator(value: string) {
  if (value === undefined) {
    return false;
  }
  if (value === "") {
    return true;
  }
  const vals = value.split("-", 2);
  return 0 < Number(vals[1]) && Number(vals[1]) < 13 && Number(vals[0]) > 1000;
}

function intValidator(value: number) {
  return (value !== undefined) && (value % 1 === 0);
}

class Autofieldable extends polymer.Base {
  protected autofields: Autofield[];
  protected autoconfigs: Array<AutofieldConfig<any>>;

  @property()
  private isReady: boolean;

  constructor() {
    super();
    this.autofields = [];
    for (let autoconfig of this.autoconfigs) {
      this.push("autofields", {
        label: autoconfig.label,
        type: this["properties"][autoconfig.propName].type,
        validator: autoconfig.validator,
        value: "a",  // TODO(pomalley): value is overwritten, unneeded
      });
    }
  }

  public createdTimestampPath(): string { return undefined; }
  public updatedTimestampPath(): string { return undefined; }

  @property({computed: "_allValid(autofields.*)", notify: true, reflectToAttribute: true})
  public allValid: boolean;
  public _allValid(autofields) {
    return this.autofields.every((autofield: Autofield) => { return autofield.validator(autofield.value); });
  }

  public addField<T>(fieldConfig: AutofieldConfig<T>) {
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
        if (this.updatedTimestampPath()) {
          this.set(this.updatedTimestampPath(), +new Date());
        }
      }
      if (this.createdTimestampPath() && !this.get(this.createdTimestampPath())) {
        this.set(this.createdTimestampPath(), +new Date());
      }
    }
    observe("autofields.#" + n + ".value")(this, "__autoObserve" + n);
  }
}

function autofield<T>(conf: {path: string, label?: string, displayValue?: (value: T) => string, groups?: string[],
                             validator?: (value: T) => boolean}) {
  return (target: Autofieldable, name: string) => {
    let t = Reflect.getMetadata("design:type", target, name);

    target.addField({
      displayValue: conf.displayValue || ((value: T) => {
        return value !== undefined ? value.toString() : "";
      }),
      groups: conf.groups || [],
      label: conf.label || name,
      path: conf.path,
      propName: name,
      validator: conf.validator || (() => { return true; }),
    });
    // chain the property decorator
    return property({type: t})(target, name);
  };
}
