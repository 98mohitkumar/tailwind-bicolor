"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  bicolor: () => bicolor,
  default: () => src_default,
  getReverseColor: () => getReverseColor
});
module.exports = __toCommonJS(src_exports);
var import_postcss = __toESM(require("postcss"));
var import_postcss_selector_parser = __toESM(require("postcss-selector-parser"));
var import_plugin = __toESM(require("tailwindcss/plugin"));
var import_withAlphaVariable = __toESM(require("tailwindcss/lib/util/withAlphaVariable"));

// src/config.ts
var variableConfig = {
  bg: { attrs: ["background-color"], plugin: "backgroundOpacity", variable: "--tw-bg-opacity" },
  text: { attrs: ["color"], plugin: "textOpacity", variable: "--tw-text-opacity" },
  decoration: { attrs: ["text-decoration-color"] },
  "border-x": {
    attrs: ["border-left-color", "border-right-color"],
    plugin: "borderOpacity",
    variable: "--tw-border-opacity"
  },
  "border-y": {
    attrs: ["border-top-color", "border-bottom-color"],
    plugin: "borderOpacity",
    variable: "--tw-border-opacity"
  },
  "border-t": { attrs: ["border-top-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  "border-r": { attrs: ["border-right-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  "border-b": { attrs: ["border-bottom-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  "border-l": { attrs: ["border-left-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  border: { attrs: ["border-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  outline: { attrs: ["outline-color"] },
  accent: { attrs: ["accent-color"] },
  caret: { attrs: ["caret-color"] },
  fill: { attrs: ["fill"] },
  stroke: { attrs: ["stroke"] },
  divide: { attrs: ["border-color"], plugin: "divideOpacity", variable: "--tw-divide-opacity" },
  shadow: { attrs: ["--tw-shadow-color"] },
  "ring-offset": { attrs: ["--tw-ring-offset-color"] },
  ring: { attrs: ["--tw-ring-color"], plugin: "ringOpacity", variable: "--tw-ring-opacity" }
};
var prefixes = Object.keys(variableConfig);
var modifierPairMap = {
  white: "black",
  black: "white",
  50: "900",
  100: "800",
  200: "700",
  300: "600",
  400: "500",
  500: "400",
  600: "300",
  700: "200",
  800: "100",
  900: "50"
};

// src/parser.ts
function parseClassColor(className) {
  const prefix = prefixes.find((pfx) => className.startsWith(`${pfx}-`));
  if (!prefix)
    return false;
  className = className.slice(prefix.length + 1);
  let result;
  if (result = /^([\w-]+)-(\d+)$/i.exec(className)) {
    return {
      prefix,
      color: result[1],
      shade: result[2]
    };
  } else if (result = /^([\w-]+)-(\d+)\/(\d*\.?\d+)$/i.exec(className)) {
    return {
      prefix,
      color: result[1],
      shade: result[2],
      opacity: result[3]
    };
  } else if (result = /^([\w-]+)$/i.exec(className)) {
    return {
      prefix,
      color: result[1]
    };
  } else if (result = /^([\w-]+)\/(\d*\.?\d+)$/i.exec(className)) {
    return {
      prefix,
      color: result[1],
      opacity: result[2]
    };
  }
  return false;
}

// src/index.ts
var wrapMediaDarkRule = (() => {
  const darkRule = import_postcss.default.atRule({
    name: "media",
    params: "(prefers-color-scheme: dark)"
  });
  return (rule) => {
    rule.replaceWith(
      darkRule.clone({
        nodes: [rule]
      })
    );
  };
})();
var addDarkClass = (selector, className = "dark") => {
  const parser = (0, import_postcss_selector_parser.default)((selectors) => {
    selectors.each((selector2) => {
      const firstChild = selector2.at(0);
      selector2.insertBefore(firstChild, import_postcss_selector_parser.default.className({ value: className }));
      selector2.insertBefore(firstChild, import_postcss_selector_parser.default.combinator({ value: " " }));
    });
  });
  return parser.processSync(selector);
};
var getReverseColor = ({
  selector,
  classColor,
  theme
}) => {
  if (classColor.shade && classColor.shade in modifierPairMap) {
    return theme(["colors", classColor.color, modifierPairMap[classColor.shade]]);
  } else if (classColor.color in modifierPairMap) {
    return theme(["colors", modifierPairMap[classColor.color]]);
  }
  return "";
};
var bicolor = ({ variantName = "bi", getColor = getReverseColor } = {}) => (0, import_plugin.default)(({ addVariant, config, theme, e: encode, corePlugins }) => {
  const darkMode = config("darkMode", "media");
  addVariant(variantName, [
    "&",
    ({ container, separator }) => {
      container.walkRules((rule) => {
        const bareSelector = rule.selector.slice(1).replace(/\\\//g, "/").split(" ")[0];
        const classColor = parseClassColor(bareSelector);
        if (!classColor)
          return;
        const colorConfig = variableConfig[classColor.prefix];
        const color = getColor({ selector: bareSelector, classColor, theme });
        if (!color)
          return;
        rule.walkDecls((decl) => {
          if (colorConfig.attrs.includes(decl.prop)) {
            decl.value = classColor.opacity ? (0, import_withAlphaVariable.withAlphaValue)(color, Number(classColor.opacity) / 100) : colorConfig.variable && corePlugins(colorConfig.plugin) ? (0, import_withAlphaVariable.default)({
              color,
              property: "color",
              variable: colorConfig.variable
            }).color : color;
          } else if (decl.prop.startsWith("--")) {
            decl.remove();
            return;
          }
        });
        if (darkMode === "class") {
          rule.selector = addDarkClass(`.${variantName}${encode(`${separator}${bareSelector}`)}`);
        } else if (Array.isArray(darkMode) && darkMode.includes("class")) {
          rule.selector = addDarkClass(
            `.${variantName}${encode(`${separator}${bareSelector}`)}`,
            darkMode[1]
          );
        } else {
          wrapMediaDarkRule(rule);
        }
      });
    }
  ]);
});
var src_default = bicolor;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bicolor,
  getReverseColor
});
