/**
 * Autofieldable objects will have automatically generated controls for their (annotated) fields.
 */

interface FieldObj {
  label: string;
  value: any;
}

interface AutofieldConfig {
  label: string;
  path: string;
  propName: string;
}

// @component("auto-fielded")
// @template("")
class Autofieldable extends polymer.Base {
  // @property()
  public autofields: FieldObj[];
  public autoconfigs: AutofieldConfig[];
  public addField(fieldConfig: AutofieldConfig) {
    this.autoconfigs = this.autoconfigs || [];
    this.autoconfigs.push(fieldConfig);
  }

  @property()
  protected isReady: boolean;

  constructor() {
    super();
    this.autofields = [];
    for (let autoconfig of this.autoconfigs) {
      this.push("autofields", {label: autoconfig.label, value: "a"});  // TODO(pomalley): value is overwritten, unneeded
    }
  }
}
// Autofielded.register();

function autofield(fieldObj: {label?: string, path: string}) {
  return (target: Autofieldable, name: string) => {
    fieldObj.label = fieldObj.label || name;
    target.addField({label: fieldObj.label, path: fieldObj.path, propName: name});
    const n = target.autoconfigs.length - 1;
    // TODO(pomalley): clean this up and move these functions into addField (?)
    target["__autoObserve" + name] = function(newValue) {
      // console.log("auto obs of " + name + " new: " + newValue);
      this.set(fieldObj.path, newValue);
    };
    observe(name)(target, "__autoObserve" + name);

    target["__autoObserve" + fieldObj.path] = function(newValue) {
      // console.log("auto obs of " + fieldObj.path + " new: " + newValue);
      this.set(name, newValue);
      this.set("autofields.#" + n + ".value", newValue);
    };
    observe(fieldObj.path)(target, "__autoObserve" + fieldObj.path);

    target["__autoObserve" + n] = function(newValue) {
      // console.log("auto obs # " + n + " new: " + newValue + " (isready: " + this.isReady + ")");
      if (this.isReady) {
        this.set(fieldObj.path, newValue);
      }
    };
    observe("autofields.#" + n + ".value")(target, "__autoObserve" + n);
    // chain the property decorator
    return property()(target, name);
  };
}